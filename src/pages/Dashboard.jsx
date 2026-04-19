 import React from 'react'
 import { Calendar, FlaskConical, Clock } from 'lucide-react'

const mockAppointments = [
  { id: 1, doctor: 'Dr. Priya Sharma', specialty: 'General Physician', time: 'Today, 11:30 AM', status: 'upcoming' },
  { id: 2, doctor: 'Dr. Arjun Mehta', specialty: 'Pulmonologist', time: 'Apr 15, 9:00 AM', status: 'completed' },
]

const mockTests = [
  { id: 1, name: 'Complete Blood Count', status: 'completed', date: 'Apr 10', result: 'Normal' },
  { id: 2, name: 'Thyroid Function', status: 'pending', date: 'Apr 20', result: null },
]

export default function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl text-white mb-1">My Records</h1>
        <p className="text-gray-500 text-sm font-body">Your appointments and lab tests in one place.</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={14} className="text-gray-400" />
          <p className="text-sm font-display font-semibold text-gray-200">Appointments</p>
        </div>
        <div className="space-y-3">
          {mockAppointments.map(appt => (
            <div key={appt.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-white">{appt.doctor}</p>
                <p className="text-xs text-gray-500 font-body">{appt.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={11} className="text-gray-600" />
                  <span className="text-xs text-gray-500 font-body">{appt.time}</span>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-body border ${
                appt.status === 'upcoming'
                  ? 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                  : 'bg-white/5 text-gray-500 border-border'
              }`}>
                {appt.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical size={14} className="text-gray-400" />
          <p className="text-sm font-display font-semibold text-gray-200">Lab Tests</p>
        </div>
        <div className="space-y-3">
          {mockTests.map(test => (
            <div key={test.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-white">{test.name}</p>
                <p className="text-xs text-gray-500 font-body">{test.date}</p>
              </div>
              <div className="text-right">
                {test.result && (
                  <p className="text-xs text-brand-400 font-body mb-1">{test.result}</p>
                )}
                <span className={`text-xs px-2.5 py-1 rounded-full font-body border ${
                  test.status === 'completed'
                    ? 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {test.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
