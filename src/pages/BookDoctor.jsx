import React from 'react'
import { useState } from 'react'
import { Star, Clock, CheckCircle } from 'lucide-react'
import { MOCK_DOCTORS } from '../utils/gemini'

const specialties = ['All', 'General Physician', 'Pulmonologist', 'Cardiologist', 'Orthopedic', 'Dermatologist', 'Neurologist']

export default function BookDoctor() {
  const [filter, setFilter] = useState('All')
  const [booked, setBooked] = useState(null) // { doctorId, slot }
  const [selected, setSelected] = useState({}) // { doctorId: slot }

  const filtered = filter === 'All' ? MOCK_DOCTORS : MOCK_DOCTORS.filter(d => d.specialty === filter)

  const handleBook = (doctorId) => {
    if (!selected[doctorId]) return
    setBooked({ doctorId, slot: selected[doctorId] })
  }

  if (booked) {
    const doc = MOCK_DOCTORS.find(d => d.id === booked.doctorId)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card p-8 max-w-sm w-full text-center fade-up">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-brand-400" />
          </div>
          <h2 className="font-display font-semibold text-xl text-white mb-1">Appointment Booked!</h2>
          <p className="text-gray-400 font-body text-sm mb-6">Your appointment has been confirmed.</p>
          <div className="bg-surface rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm font-body">
              <span className="text-gray-500">Doctor</span>
              <span className="text-white">{doc.name}</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-gray-500">Specialty</span>
              <span className="text-gray-300">{doc.specialty}</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-gray-500">Time</span>
              <span className="text-brand-400">{booked.slot}</span>
            </div>
          </div>
          <button onClick={() => { setBooked(null); setSelected({}) }} className="btn-primary w-full">
            Book Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl text-white mb-1">Book a Doctor</h1>
        <p className="text-gray-500 font-body text-sm">Select a specialist and pick your time slot.</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {specialties.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-sm px-3 py-1.5 rounded-full font-body border transition-all ${
              filter === s
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'border-border text-gray-400 hover:border-white/25 hover:text-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Doctors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(doc => (
          <div key={doc.id} className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-display font-semibold text-sm ${doc.color}`}>
                {doc.image}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm font-body truncate">{doc.name}</p>
                <p className="text-gray-500 text-xs font-body">{doc.specialty}</p>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-body">{doc.rating}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-2.5 font-body flex items-center gap-1">
              <Clock size={11} /> Available today
            </p>
            <div className="flex gap-2 flex-wrap mb-4">
              {doc.slots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelected(prev => ({ ...prev, [doc.id]: slot }))}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-body transition-all ${
                    selected[doc.id] === slot
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'border-border text-gray-400 hover:border-brand-500/50 hover:text-brand-400'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleBook(doc.id)}
              disabled={!selected[doc.id]}
              className="btn-primary w-full text-sm py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {selected[doc.id] ? `Book ${selected[doc.id]}` : 'Select a slot'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
