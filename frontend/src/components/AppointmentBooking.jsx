import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AppointmentBooking({ onJoinRoom, selectedDoctor: doctorFromProps }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userAppointments, setUserAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      loadDoctors();
      loadUserAppointments();
    }
  }, []);

  // Handle doctor from props
  useEffect(() => {
    if (doctorFromProps && doctors.length > 0) {
      const doctor = doctors.find(d => d._id === doctorFromProps._id);
      if (doctor) {
        setSelectedDoctor(doctor);
      }
    }
  }, [doctorFromProps, doctors]);

  const loadDoctors = async () => {
    try {
      const { data } = await api.get('/users/doctors');
      setDoctors(data);
    } catch (error) {
      setMessage({ text: 'Error loading doctors', type: 'error' });
    }
  };

  const loadUserAppointments = async () => {
    try {
      const { data } = await api.get(`/appointments/patient/${user.id}`);
      setUserAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      setMessage({ text: 'Please fill all required fields', type: 'error' });
      return;
    }

    try {
      const appointmentData = {
        doctorId: selectedDoctor._id,
        patientId: user.id,
        date: appointmentDate,
        time: appointmentTime,
        symptoms: symptoms,
        status: 'pending'
      };

      await api.post('/appointments', appointmentData);
      setMessage({ text: 'Appointment booked successfully!', type: 'success' });
      
      // Reset form
      setAppointmentDate('');
      setAppointmentTime('');
      setSymptoms('');
      
      // Reload appointments
      loadUserAppointments();
    } catch (error) {
      setMessage({ text: 'Error booking appointment', type: 'error' });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="section-title mb-4">Book an Appointment</div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
              <div className="grid md:grid-cols-2 gap-2">
                {doctors.map(doctor => (
                  <div 
                    key={doctor._id} 
                    onClick={() => handleDoctorSelect(doctor)}
                    className={`p-3 border rounded-lg cursor-pointer ${selectedDoctor && selectedDoctor._id === doctor._id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="font-medium">{doctor.name}</div>
                    <div className="text-sm text-gray-500">{doctor.specialization || 'General Physician'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full p-2 border rounded"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input 
                  type="time" 
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (Optional)</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder="Describe your symptoms..."
              ></textarea>
            </div>

            <button type="submit" className="btn-primary">
              Book Appointment
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="section-title mb-4">Your Appointments</div>
          
          {userAppointments.length === 0 ? (
            <p className="text-gray-500">You don't have any appointments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userAppointments.map(appointment => (
                    <tr key={appointment._id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appointment.doctorName}</div>
                        <div className="text-xs text-gray-500">{appointment.doctorSpecialization}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(appointment.date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(appointment.time)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-xs font-medium capitalize ${getStatusClass(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        {appointment.status === 'confirmed' && (
                          <button 
                            onClick={() => onJoinRoom ? onJoinRoom(appointment._id) : null}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Join
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {appointment.status === 'pending' && (
                          <button 
                            onClick={async () => {
                              try {
                                await api.put(`/appointments/${appointment._id}`, { status: 'cancelled' });
                                loadUserAppointments();
                              } catch (error) {
                                console.error('Error cancelling appointment:', error);
                              }
                            }}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}