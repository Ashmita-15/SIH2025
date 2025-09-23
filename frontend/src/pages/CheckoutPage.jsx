import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import api from '../services/api'

export default function CheckoutPage() {
  const { pharmacyId } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  const [cart, setCart] = useState(null)
  const [pharmacy, setPharmacy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orderType, setOrderType] = useState('delivery')
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  })
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      navigate('/login')
      return
    }
    fetchCheckoutData()
  }, [])

  const fetchCheckoutData = async () => {
    try {
      setLoading(true)
      
      // Fetch cart
      const { data: cartData } = await api.get(`/pharmacy/cart/${pharmacyId}`)
      if (!cartData || cartData.items?.length === 0) {
        alert('Your cart is empty!')
        navigate(`/pharmacy-shop/${pharmacyId}`)
        return
      }
      setCart(cartData)
      
      // Fetch pharmacy details
      const { data: pharmacyData } = await api.get(`/pharmacy/${pharmacyId}`)
      setPharmacy(pharmacyData)
      
      // Set default order type based on pharmacy delivery availability
      if (!pharmacyData.deliveryAvailable) {
        setOrderType('pickup')
      }
      
    } catch (error) {
      console.error('Error fetching checkout data:', error)
      alert('Error loading checkout data')
      navigate(`/pharmacy-shop/${pharmacyId}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateDeliveryFee = () => {
    if (orderType === 'pickup') return 0
    if (!cart) return 0
    
    const subtotal = cart.totalAmount
    return subtotal < 500 ? 50 : 0 // Free delivery above ₹500
  }

  const getFinalTotal = () => {
    if (!cart) return 0
    return cart.totalAmount + calculateDeliveryFee()
  }

  const validateForm = () => {
    if (orderType === 'delivery') {
      if (!deliveryAddress.name.trim()) {
        alert('Please enter your name')
        return false
      }
      if (!deliveryAddress.phone.trim()) {
        alert('Please enter your phone number')
        return false
      }
      if (!deliveryAddress.addressLine1.trim()) {
        alert('Please enter your address')
        return false
      }
      if (!deliveryAddress.city.trim()) {
        alert('Please enter your city')
        return false
      }
      if (!deliveryAddress.state.trim()) {
        alert('Please enter your state')
        return false
      }
      if (!deliveryAddress.pincode.trim()) {
        alert('Please enter your pincode')
        return false
      }
    }
    return true
  }

  const placeOrder = async () => {
    if (!validateForm()) return
    
    try {
      setSubmitting(true)
      
      const orderData = {
        pharmacyId,
        orderType,
        notes
      }
      
      if (orderType === 'delivery') {
        orderData.deliveryAddress = deliveryAddress
      }
      
      const { data } = await api.post('/pharmacy/orders', orderData)
      
      // Redirect to order success page
      navigate(`/order-success/${data._id}`)
      
    } catch (error) {
      alert('Error placing order: ' + error.response?.data?.message)
    } finally {
      setSubmitting(false)
    }
  }

  const hasPrescriptionItems = () => {
    return cart?.items?.some(item => item.medicineId.prescriptionRequired) || false
  }

  if (loading) {
    return (
      <Dashboard title="Checkout">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading checkout...</div>
        </div>
      </Dashboard>
    )
  }

  if (!cart || !pharmacy) {
    return (
      <Dashboard title="Checkout">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Unable to load checkout data</div>
          <button 
            onClick={() => navigate(`/pharmacy-shop/${pharmacyId}`)}
            className="btn-primary mt-4"
          >
            Back to Shop
          </button>
        </div>
      </Dashboard>
    )
  }

  return (
    <Dashboard title={`Checkout - ${pharmacy.name}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Type Selection */}
          <div className="card">
            <div className="card-body">
              <h3 className="section-title mb-4">Order Type</h3>
              <div className="space-y-3">
                {pharmacy.deliveryAvailable && (
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="orderType"
                      value="delivery"
                      checked={orderType === 'delivery'}
                      onChange={e => setOrderType(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <div className="font-medium">Home Delivery</div>
                      <div className="text-sm text-gray-600">
                        Get medicines delivered to your address
                        {calculateDeliveryFee() > 0 && (
                          <span className="text-orange-600"> (+₹{calculateDeliveryFee()} delivery fee)</span>
                        )}
                      </div>
                    </div>
                  </label>
                )}
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="orderType"
                    value="pickup"
                    checked={orderType === 'pickup'}
                    onChange={e => setOrderType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium">Store Pickup</div>
                    <div className="text-sm text-gray-600">
                      Collect your order from {pharmacy.name}
                    </div>
                  </div>
                </label>
              </div>
              
              {orderType === 'pickup' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-1">Pickup Address:</div>
                  <div className="text-sm text-blue-700">
                    {pharmacy.address || pharmacy.location}<br/>
                    📞 {pharmacy.contact}<br/>
                    ⏰ {pharmacy.openingHours?.open} - {pharmacy.openingHours?.close}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address Form */}
          {orderType === 'delivery' && (
            <div className="card">
              <div className="card-body">
                <h3 className="section-title mb-4">Delivery Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="Full Name *"
                    value={deliveryAddress.name}
                    onChange={e => setDeliveryAddress({...deliveryAddress, name: e.target.value})}
                  />
                  <input
                    className="input"
                    placeholder="Phone Number *"
                    value={deliveryAddress.phone}
                    onChange={e => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                  />
                  <input
                    className="input md:col-span-2"
                    placeholder="Address Line 1 *"
                    value={deliveryAddress.addressLine1}
                    onChange={e => setDeliveryAddress({...deliveryAddress, addressLine1: e.target.value})}
                  />
                  <input
                    className="input md:col-span-2"
                    placeholder="Address Line 2 (Optional)"
                    value={deliveryAddress.addressLine2}
                    onChange={e => setDeliveryAddress({...deliveryAddress, addressLine2: e.target.value})}
                  />
                  <input
                    className="input"
                    placeholder="City *"
                    value={deliveryAddress.city}
                    onChange={e => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                  />
                  <input
                    className="input"
                    placeholder="State *"
                    value={deliveryAddress.state}
                    onChange={e => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                  />
                  <input
                    className="input"
                    placeholder="Pincode *"
                    value={deliveryAddress.pincode}
                    onChange={e => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
                  />
                  <input
                    className="input"
                    placeholder="Landmark (Optional)"
                    value={deliveryAddress.landmark}
                    onChange={e => setDeliveryAddress({...deliveryAddress, landmark: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Prescription Notice */}
          {hasPrescriptionItems() && (
            <div className="card">
              <div className="card-body">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">Prescription Required</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Your order contains prescription medicines. Please have your valid prescription ready 
                      for verification {orderType === 'delivery' ? 'at the time of delivery' : 'when collecting from the pharmacy'}.
                    </p>
                    <div className="text-xs text-gray-500">
                      Note: Orders with prescription medicines may require additional verification time.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          <div className="card">
            <div className="card-body">
              <h3 className="section-title mb-4">Additional Notes (Optional)</h3>
              <textarea
                className="input"
                placeholder="Any special instructions or notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          
          {/* Order Items */}
          <div className="card">
            <div className="card-body">
              <h3 className="section-title mb-4">Order Summary</h3>
              <div className="space-y-3">
                {cart.items.map(item => (
                  <div key={item.medicineId._id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.medicineId.medicineName}</div>
                      <div className="text-xs text-gray-600">
                        {item.medicineId.brand && `${item.medicineId.brand} • `}
                        Qty: {item.quantity}
                        {item.medicineId.prescriptionRequired && (
                          <span className="text-purple-600 font-medium"> • Rx Required</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-medium">₹{item.finalPrice * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{cart.totalAmount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>
                    {calculateDeliveryFee() === 0 ? 'FREE' : `₹${calculateDeliveryFee()}`}
                  </span>
                </div>
                
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{getFinalTotal()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card">
            <div className="card-body">
              <h3 className="section-title mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    defaultChecked
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive your order</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={placeOrder}
            disabled={submitting}
            className={`btn-primary w-full text-lg py-3 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Placing Order...' : `Place Order - ₹${getFinalTotal()}`}
          </button>

          {/* Back to Shop */}
          <button
            onClick={() => navigate(`/pharmacy-shop/${pharmacyId}`)}
            className="btn-secondary w-full"
          >
            ← Back to Shop
          </button>
        </div>
      </div>
    </Dashboard>
  )
}