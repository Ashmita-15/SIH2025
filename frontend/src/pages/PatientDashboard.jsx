import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import SymptomChecker from '../components/SymptomChecker'
import VideoCall from '../components/VideoCall'
import ProfileSection from '../components/ProfileSection'
import AppointmentBooking from '../components/AppointmentBooking'
import HealthRecords from '../components/HealthRecords'
import DoctorsList from '../components/DoctorsList'
import api from '../services/api'

export default function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [roomId, setRoomId] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  const handleJoinRoom = (appointmentId) => {
    setRoomId(appointmentId)
    setActiveTab('consultation')
  }

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setActiveTab('appointments')
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <div className="card-body">
                <div className="section-title mb-4">Quick Actions</div>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('doctors')} 
                    className="btn-primary w-full justify-center"
                  >
                    Find Doctors
                  </button>
                  <button 
                    onClick={() => setActiveTab('appointments')} 
                    className="btn-secondary w-full justify-center"
                  >
                    My Appointments
                  </button>
                  <button 
                    onClick={() => setActiveTab('records')} 
                    className="btn-secondary w-full justify-center"
                  >
                    View Health Records
                  </button>
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    className="btn-outline w-full justify-center"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
            <SymptomChecker />
          </div>
        );
      case 'appointments':
        return <AppointmentBooking onJoinRoom={handleJoinRoom} selectedDoctor={selectedDoctor} />;
      case 'profile':
        return <ProfileSection />;
      case 'records':
        return <HealthRecords />;
      case 'doctors':
        return <DoctorsList onSelectDoctor={handleSelectDoctor} />;
      case 'consultation':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="section-title">Video Consultation</div>
              <button 
                onClick={() => setActiveTab('appointments')} 
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Appointments
              </button>
            </div>
            <VideoCall roomId={roomId} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dashboard title="Patient Dashboard">
      <div className="mb-6 border-b">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'doctors' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Find Doctors
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'appointments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'records' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Health Records
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Profile
          </button>
        </nav>
      </div>
      
      {renderTabContent()}
    </Dashboard>
  )
}


