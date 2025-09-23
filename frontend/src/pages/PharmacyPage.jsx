import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import api from '../services/api'

export default function PharmacyPage() {
  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    fetchPharmacies()
  }, [])

  const fetchPharmacies = async () => {
    try {
      setLoading(true)
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (locationFilter) params.location = locationFilter
      
      const { data } = await api.get('/pharmacy/all', { params })
      setPharmacies(data)
    } catch (error) {
      console.error('Error fetching pharmacies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchPharmacies()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setLocationFilter('')
    fetchPharmacies()
  }

  const getRatingDisplay = (ratings) => {
    if (ratings.count === 0) return 'No ratings yet'
    return `${ratings.average.toFixed(1)} ⭐ (${ratings.count} reviews)`
  }

  const getDeliveryBadge = (deliveryAvailable) => {
    return deliveryAvailable ? (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
        Delivery Available
      </span>
    ) : (
      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
        Pickup Only
      </span>
    )
  }

  if (loading) {
    return (
      <Dashboard title="Find Pharmacies">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading pharmacies...</div>
        </div>
      </Dashboard>
    )
  }

  return (
    <Dashboard title="Find Pharmacies">
      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="input"
              placeholder="Search pharmacies..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            <input
              className="input"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            <div className="flex gap-2">
              <button onClick={handleSearch} className="btn-primary">
                Search
              </button>
              <button onClick={clearFilters} className="btn-secondary">
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pharmacies.map(pharmacy => (
          <Link
            key={pharmacy._id}
            to={`/pharmacy-shop/${pharmacy._id}`}
            className="block hover:shadow-lg transition-shadow"
          >
            <div className="card h-full">
              <div className="card-body">
                {/* Pharmacy Image Placeholder */}
                <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                  {pharmacy.image ? (
                    <img 
                      src={pharmacy.image} 
                      alt={pharmacy.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-4xl">🏥</div>
                  )}
                </div>

                {/* Pharmacy Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{pharmacy.name}</h3>
                    {getDeliveryBadge(pharmacy.deliveryAvailable)}
                  </div>
                  
                  <div className="text-gray-600 text-sm">
                    📍 {pharmacy.location}
                  </div>
                  
                  <div className="text-gray-600 text-sm">
                    📞 {pharmacy.contact}
                  </div>

                  {pharmacy.description && (
                    <div className="text-gray-600 text-sm">
                      {pharmacy.description.length > 100 
                        ? `${pharmacy.description.substring(0, 100)}...`
                        : pharmacy.description
                      }
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-sm text-gray-600">
                      {getRatingDisplay(pharmacy.ratings)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {pharmacy.openingHours?.open} - {pharmacy.openingHours?.close}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-blue-600 text-sm font-medium hover:underline">
                      View Medicines →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {pharmacies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No pharmacies found</div>
          <div className="text-gray-400">
            {searchTerm || locationFilter 
              ? 'Try adjusting your search criteria'
              : 'No pharmacies are currently registered'
            }
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl mb-2">🚚</div>
            <h4 className="font-semibold mb-2">Fast Delivery</h4>
            <p className="text-sm text-gray-600">
              Get your medicines delivered quickly to your doorstep
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="font-semibold mb-2">Genuine Medicines</h4>
            <p className="text-sm text-gray-600">
              All medicines are sourced from verified pharmacy partners
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl mb-2">📱</div>
            <h4 className="font-semibold mb-2">Easy Ordering</h4>
            <p className="text-sm text-gray-600">
              Browse, order, and track your medicines with ease
            </p>
          </div>
        </div>
      </div>
    </Dashboard>
  )
}