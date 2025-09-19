import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import VideoCall from '../components/VideoCall'
import ProfileSection from '../components/ProfileSection'
import PatientTracker from '../components/PatientTracker'
import api from '../services/api'

export default function DoctorDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [appointments, setAppointments] = useState([])
  const [selected, setSelected] = useState(null)

  const load = async () => {
    const { data } = await api.get(`/appointments/doctor/${user.id}`)
    setAppointments(data)
  }

  useEffect(() => { load() }, [])

  const [activeTab, setActiveTab] = useState('appointments')

  const renderTabContent = () => {
    switch(activeTab) {
      case 'appointments':
        return (
          <>
            <div className="card">
              <div className="card-body">
                <div className="section-title mb-2">Your Appointments</div>
                {appointments.length > 0 ? (
                  <ul className="space-y-2">
                    {appointments.map(a => (
                      <li key={a._id} className="border p-2 rounded flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{new Date(a.appointmentDate).toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Patient: {a.patientId?.name || ''}</div>
                          <div className="text-sm text-gray-500">Status: {a.status}</div>
                        </div>
                        <button className="btn-primary" onClick={() => setSelected(a)}>Join</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No appointments scheduled</p>
                )}
              </div>
            </div>

            {selected && (
              <div className="space-y-2 mt-4">
                <div className="section-title">Video Consultation</div>
                <VideoCall roomId={`${selected._id}`} />
              </div>
            )}
          </>
        );
      case 'profile':
        return <ProfileSection />;
      case 'patients':
        return <PatientTracker />;
      default:
        return null;
    }
  };

  return (
    <Dashboard title="Doctor Dashboard">
      <div className="mb-6 border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'appointments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'patients' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Patient Tracker
          </button>
        </nav>
      </div>
      
      {renderTabContent()}
    </Dashboard>
  )
}


