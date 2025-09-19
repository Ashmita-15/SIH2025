import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo.svg'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container-app py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Rural Telemedicine" className="h-10" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-slate-700 hover:text-blue-600 font-medium">Home</Link>
          <a href="#features" className="text-slate-700 hover:text-blue-600 font-medium">Features</a>
          <a href="#" className="text-slate-700 hover:text-blue-600 font-medium">About</a>
          <a href="#" className="text-slate-700 hover:text-blue-600 font-medium">Contact</a>
          
          {!user && (
            <Link to="/login" className="btn-primary ml-2">
              Login / Sign Up
            </Link>
          )}
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-slate-700">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-slate-500 ml-2 capitalize">({user.role})</span>
              </div>
              <Link 
                to={`/${user.role}`} 
                className="btn-primary"
              >
                Dashboard
              </Link>
              <button 
                onClick={logout} 
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-slate-700" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-3">
          <div className="container-app space-y-3">
            <Link to="/" className="block text-slate-700 hover:text-blue-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <a href="#features" className="block text-slate-700 hover:text-blue-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#" className="block text-slate-700 hover:text-blue-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#" className="block text-slate-700 hover:text-blue-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            
            {!user && (
              <Link to="/login" className="block btn-primary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                Login / Sign Up
              </Link>
            )}
            
            {user && (
              <div className="pt-2 border-t border-slate-200">
                <div className="text-slate-700 mb-2">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-slate-500 ml-2 capitalize">({user.role})</span>
                </div>
                <button 
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }} 
                  className="btn-secondary w-full"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}


