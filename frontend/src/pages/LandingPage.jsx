import React from 'react'
import { Link } from 'react-router-dom'

// Import assets
import heroBanner from '../assets/images/hero-banner.png'
import doctorIllustration from '../assets/images/doctor-illustration.svg'
import patientIllustration from '../assets/images/patient-illustration.svg'
import waveDivider from '../assets/images/wave-divider.svg'
import mobileAppMockup from '../assets/images/mobile-app-mockup.svg'
import teleconsultationIcon from '../assets/images/teleconsultation-icon.svg'
import healthRecordsIcon from '../assets/images/health-records-icon.svg'
import medicineTrackerIcon from '../assets/images/medicine-tracker-icon.svg'
import logo from '../assets/images/logo.svg'

export default function LandingPage() {
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      role: 'Cardiologist',
      content: 'This platform has allowed me to reach patients in remote villages who would otherwise have no access to specialized cardiac care.',
      avatar: '👨‍⚕️'
    },
    {
      id: 2,
      name: 'Meera Devi',
      role: 'Patient',
      content: 'I no longer need to travel 50km to consult with my doctor. The video calls are clear and the medicine reminders are very helpful.',
      avatar: '👩'
    },
    {
      id: 3,
      name: 'Suresh Patel',
      role: 'Village Health Worker',
      content: 'The platform has transformed how we deliver healthcare in our village. We can now connect patients with specialists instantly.',
      avatar: '👨‍⚕️'
    }
  ];

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-xl mx-4 md:mx-8 lg:mx-auto lg:max-w-6xl shadow-lg">
        <img src={heroBanner} alt="Rural Telemedicine" className="w-full h-auto" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-center">Rural Telemedicine</h1>
          <p className="text-xl md:text-2xl max-w-2xl text-center font-light">Healthcare without boundaries</p>
          <div className="mt-8 flex gap-4">
            {!JSON.parse(localStorage.getItem('user') || 'null') ? (
              <Link to="/login" className="btn-primary text-lg px-6 py-3">Get Started</Link>
            ) : (
              <Link to={`/${JSON.parse(localStorage.getItem('user')).role}`} className="btn-primary text-lg px-6 py-3">Go to Dashboard</Link>
            )}
            <a href="#features" className="btn bg-white/20 backdrop-blur hover:bg-white/30 text-white text-lg px-6 py-3">Learn More</a>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="container-app text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Connecting Rural Communities to Quality Healthcare</h2>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">Our platform provides low-bandwidth teleconsultations, digital health records, and real-time medicine availability tracking designed specifically for rural communities with limited connectivity.</p>
      </section>

      {/* Features Section */}
      <section id="features" className="container-app">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card transform transition hover:scale-105 hover:shadow-md">
            <div className="card-body text-center">
              <img src={teleconsultationIcon} alt="Teleconsultation" className="w-20 h-20 mx-auto mb-4" />
              <div className="section-title mb-2">Teleconsultation</div>
              <p className="text-slate-600">Video calls optimized for low bandwidth with simple room joining. Connect with doctors from anywhere, even with limited internet.</p>
            </div>
          </div>
          <div className="card transform transition hover:scale-105 hover:shadow-md">
            <div className="card-body text-center">
              <img src={healthRecordsIcon} alt="Health Records" className="w-20 h-20 mx-auto mb-4" />
              <div className="section-title mb-2">Health Records</div>
              <p className="text-slate-600">Store your medical history securely and access it anytime. Download PDF reports for offline access or to share with other healthcare providers.</p>
            </div>
          </div>
          <div className="card transform transition hover:scale-105 hover:shadow-md">
            <div className="card-body text-center">
              <img src={medicineTrackerIcon} alt="Medicine Tracker" className="w-20 h-20 mx-auto mb-4" />
              <div className="section-title mb-2">Medicine Tracker</div>
              <p className="text-slate-600">Check real-time availability of medicines at local pharmacies. Get notified when essential medications are back in stock.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 text-white">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Villages Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Consultations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-blue-100">Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Pharmacies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-app">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">What People Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card bg-white/80">
              <div className="card-body">
                <div className="text-blue-600 text-4xl mb-4">"</div>
                <p className="text-slate-700 mb-4 italic">{testimonial.quote}</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-slate-500 text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-app text-center">
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="card-body py-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Ready to Get Started?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-6">Join thousands of users who are already benefiting from our telemedicine platform.</p>
            {!JSON.parse(localStorage.getItem('user') || 'null') && (
              <Link to="/login" className="btn-primary text-lg px-6 py-3">Sign Up Now</Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-12">
        <div className="container-app">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Rural Telemedicine</h3>
              <p className="text-slate-300">Bringing quality healthcare to every corner of rural communities.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                {!JSON.parse(localStorage.getItem('user') || 'null') ? (
                  <li><Link to="/login" className="hover:text-white">Login</Link></li>
                ) : (
                  <li><Link to={`/${JSON.parse(localStorage.getItem('user')).role}`} className="hover:text-white">Dashboard</Link></li>
                )}
                <li><a href="#" className="hover:text-white">About Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white">Teleconsultation</a></li>
                <li><a href="#" className="hover:text-white">Health Records</a></li>
                <li><a href="#" className="hover:text-white">Medicine Tracker</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-slate-300">
                <li>Email: info@ruralmed.org</li>
                <li>Phone: +91 98765 43210</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-6 text-center text-slate-400">
            <p>© {new Date().getFullYear()} Rural Telemedicine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


