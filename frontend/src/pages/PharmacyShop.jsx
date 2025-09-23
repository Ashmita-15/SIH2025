import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import api from '../services/api'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SIGNAL_URL || 'http://localhost:5000'

export default function PharmacyShop() {
  const { pharmacyId } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  const [pharmacy, setPharmacy] = useState(null)
  const [medicines, setMedicines] = useState([])
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    const socket = io(SOCKET_URL)
    
    // Subscribe to real-time stock updates for this pharmacy
    socket.emit('subscribe-pharmacy-updates', pharmacyId)
    
    // Listen for stock updates
    socket.on('stock-updated', (data) => {
      if (data.pharmacyId === pharmacyId) {
        // Update medicine stock in real-time
        setMedicines(prev => prev.map(med => 
          med._id === data.medicineId 
            ? { ...med, quantity: data.newQuantity || data.medicine?.quantity || med.quantity }
            : med
        ))
      }
    })
    
    socket.on('medicine-added', (data) => {
      if (data.pharmacyId === pharmacyId) {
        fetchMedicines()
      }
    })
    
    socket.on('medicine-removed', (data) => {
      if (data.pharmacyId === pharmacyId) {
        setMedicines(prev => prev.filter(med => med._id !== data.medicineId))
      }
    })
    
    fetchPharmacyData()
    
    return () => {
      socket.emit('unsubscribe-pharmacy-updates', pharmacyId)
      socket.disconnect()
    }
  }, [pharmacyId])

  useEffect(() => {
    fetchMedicines()
  }, [searchTerm, categoryFilter, currentPage])

  const fetchPharmacyData = async () => {
    try {
      setLoading(true)
      
      // Fetch pharmacy details
      const { data: pharmacyData } = await api.get(`/pharmacy/${pharmacyId}`)
      setPharmacy(pharmacyData)
      
      // Fetch cart if user is logged in as patient
      if (user && user.role === 'patient') {
        try {
          const { data: cartData } = await api.get(`/pharmacy/cart/${pharmacyId}`)
          setCart(cartData)
        } catch (error) {
          // Cart might not exist yet, that's okay
          console.log('No cart found, will be created when adding items')
        }
      }
      
    } catch (error) {
      console.error('Error fetching pharmacy data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMedicines = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 12
      }
      
      if (searchTerm) params.search = searchTerm
      if (categoryFilter !== 'all') params.category = categoryFilter
      
      const { data } = await api.get(`/pharmacy/${pharmacyId}/medicines`, { params })
      setMedicines(data.medicines)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching medicines:', error)
    }
  }

  const addToCart = async (medicineId, quantity = 1) => {
    try {
      const { data } = await api.post('/pharmacy/cart/add', {
        pharmacyId,
        medicineId,
        quantity
      })
      setCart(data)
      alert('Added to cart successfully!')
    } catch (error) {
      alert('Error adding to cart: ' + error.response?.data?.message)
    }
  }

  const updateCartItem = async (medicineId, quantity) => {
    try {
      const { data } = await api.put(`/pharmacy/cart/${pharmacyId}/${medicineId}`, { quantity })
      setCart(data)
    } catch (error) {
      alert('Error updating cart: ' + error.response?.data?.message)
    }
  }

  const removeFromCart = async (medicineId) => {
    try {
      const { data } = await api.delete(`/pharmacy/cart/${pharmacyId}/${medicineId}`)
      setCart(data)
    } catch (error) {
      alert('Error removing from cart: ' + error.response?.data?.message)
    }
  }

  const clearCart = async () => {
    try {
      const { data } = await api.delete(`/pharmacy/cart/${pharmacyId}/clear`)
      setCart(data)
      alert('Cart cleared successfully!')
    } catch (error) {
      alert('Error clearing cart: ' + error.response?.data?.message)
    }
  }

  const getStockStatusBadge = (medicine) => {
    if (medicine.quantity === 0) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Out of Stock</span>
    } else if (medicine.quantity <= medicine.minQuantity) {
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Low Stock</span>
    }
    return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">In Stock</span>
  }

  const getCartItemCount = () => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0
  }

  const categories = ['General', 'Prescription', 'Ayurvedic', 'Homeopathic', 'Vitamins']

  if (loading) {
    return (
      <Dashboard title="Loading...">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading pharmacy...</div>
        </div>
      </Dashboard>
    )
  }

  if (!pharmacy) {
    return (
      <Dashboard title="Pharmacy Not Found">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Pharmacy not found</div>
        </div>
      </Dashboard>
    )
  }

  return (
    <Dashboard title={pharmacy.name}>
      {/* Pharmacy Header */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="section-title mb-2">{pharmacy.name}</h2>
              <div className="space-y-2 text-gray-600">
                <div>📍 {pharmacy.address || pharmacy.location}</div>
                <div>📞 {pharmacy.contact}</div>
                {pharmacy.email && <div>📧 {pharmacy.email}</div>}
                <div>⏰ {pharmacy.openingHours?.open} - {pharmacy.openingHours?.close}</div>
                {pharmacy.deliveryAvailable && (
                  <div className="text-green-600">🚚 Delivery available within {pharmacy.deliveryRadius}km</div>
                )}
              </div>
              {pharmacy.description && (
                <div className="mt-4 text-gray-700">
                  {pharmacy.description}
                </div>
              )}
            </div>
            
            {user?.role === 'patient' && (
              <div className="flex flex-col justify-center">
                <button 
                  onClick={() => setShowCart(!showCart)}
                  className="btn-primary mb-2 relative"
                >
                  🛒 Cart ({getCartItemCount()})
                </button>
                <div className="text-sm text-gray-600 text-center">
                  Total: ₹{cart?.totalAmount || 0}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && cart && user?.role === 'patient' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Cart</h3>
                <button onClick={() => setShowCart(false)} className="text-gray-500 text-xl">
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {cart.items?.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Your cart is empty
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.items?.map(item => (
                      <div key={item.medicineId._id} className="border-b pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.medicineId.medicineName}</h4>
                            <div className="text-sm text-gray-600">{item.medicineId.brand}</div>
                            <div className="text-sm text-green-600">₹{item.finalPrice} each</div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.medicineId._id)}
                            className="text-red-500 text-sm hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateCartItem(item.medicineId._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="btn-secondary text-xs px-2 py-1"
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartItem(item.medicineId._id, item.quantity + 1)}
                            disabled={item.quantity >= item.medicineId.quantity}
                            className="btn-secondary text-xs px-2 py-1"
                          >
                            +
                          </button>
                          <span className="ml-auto font-medium">₹{item.finalPrice * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total: ₹{cart.totalAmount}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <button 
                        onClick={() => {
                          if (!cart?.items?.length || cart.items.length === 0) {
                            alert('Your cart is empty!')
                            return
                          }
                          setShowCart(false)
                          // Navigate to checkout using React Router
                          navigate(`/checkout/${pharmacyId}`)
                        }}
                        disabled={!cart?.items?.length || cart.items.length === 0}
                        className="btn-primary w-full"
                      >
                        Proceed to Checkout
                      </button>
                      <button onClick={clearCart} className="btn-secondary w-full">
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              className="input md:col-span-2"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
            <select
              className="input"
              value={categoryFilter}
              onChange={e => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="text-sm text-gray-600 flex items-center">
              {medicines.length} medicines found
            </div>
          </div>
        </div>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {medicines.map(medicine => (
          <div key={medicine._id} className="card">
            <div className="card-body">
              {/* Medicine Image Placeholder */}
              <div className="w-full h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-3 flex items-center justify-center">
                {medicine.image ? (
                  <img 
                    src={medicine.image} 
                    alt={medicine.medicineName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-2xl">💊</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm">{medicine.medicineName}</h4>
                  {getStockStatusBadge(medicine)}
                </div>
                
                {medicine.brand && (
                  <div className="text-xs text-gray-600">Brand: {medicine.brand}</div>
                )}
                
                <div className="text-xs text-gray-600">
                  {medicine.form} • {medicine.dosage}
                </div>
                
                {medicine.prescriptionRequired && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    Prescription Required
                  </span>
                )}
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-green-600">₹{medicine.finalPrice}</div>
                    {medicine.discount > 0 && (
                      <div className="text-xs text-gray-500 line-through">₹{medicine.price}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    Stock: {medicine.quantity}
                  </div>
                </div>

                {medicine.description && (
                  <div className="text-xs text-gray-600">
                    {medicine.description.length > 80 
                      ? `${medicine.description.substring(0, 80)}...`
                      : medicine.description
                    }
                  </div>
                )}
                
                {user?.role === 'patient' && (
                  <button 
                    onClick={() => addToCart(medicine._id)}
                    disabled={medicine.quantity === 0}
                    className={`btn-primary text-xs w-full mt-2 ${
                      medicine.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {medicine.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {medicines.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No medicines found</div>
          <div className="text-gray-400">
            {searchTerm || categoryFilter !== 'all'
              ? 'Try adjusting your search criteria'
              : 'This pharmacy has no medicines listed yet'
            }
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {!user && (
        <div className="mt-8 text-center">
          <div className="text-gray-600 mb-4">Please login as a patient to add medicines to cart</div>
          <a href="/login" className="btn-primary">
            Login
          </a>
        </div>
      )}
    </Dashboard>
  )
}
