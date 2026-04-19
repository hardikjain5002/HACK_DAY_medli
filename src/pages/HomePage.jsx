import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Calendar, FlaskConical, FileText, ArrowRight, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Activity,
    title: 'Symptom Checker',
    desc: 'Describe what you feel. Gemini AI triages and tells you which specialist to see.',
    path: '/symptoms',
    badge: 'AI-powered',
    badgeColor: 'bg-brand-500/15 text-brand-400 border-brand-500/25',
    accent: 'group-hover:text-brand-400',
  },
  {
    icon: Calendar,
    title: 'Book a Doctor',
    desc: 'Browse doctors by specialty and book an available slot in seconds.',
    path: '/book-doctor',
    badge: null,
    accent: 'group-hover:text-blue-400',
  },
  {
    icon: FlaskConical,
    title: 'Lab Tests',
    desc: 'Book common blood tests. AI explains what each test is for in plain language.',
    path: '/lab-tests',
    badge: 'AI explains',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    accent: 'group-hover:text-purple-400',
  },
  {
    icon: FileText,
    title: 'Prescription Reader',
    desc: 'Photograph your prescription. Gemini reads the medicines and explains the dosage.',
    path: '/prescription',
    badge: 'Gemini Vision',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    accent: 'group-hover:text-amber-400',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">

      {/* Hero */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-1.5 text-xs text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-full px-3 py-1.5 font-body mb-6">
          <Sparkles size={12} />
          Powered by Google Gemini
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-4">
          Know which doctor<br />
          <span className="text-brand-400">before you go.</span>
        </h1>
        <p className="text-gray-400 text-lg font-body leading-relaxed max-w-xl">
          MEDLI uses AI to triage your symptoms, recommend the right specialist, and prepare you for your hospital visit. In English or Hindi.
        </p>
        <div className="flex gap-3 mt-8">
          <button onClick={() => navigate('/symptoms')} className="btn-primary flex items-center gap-2">
            Check Symptoms <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/book-doctor')} className="btn-ghost">
            Book a Doctor
          </button>
        </div>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map(({ icon: Icon, title, desc, path, badge, badgeColor, accent }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="card p-5 text-left group hover:border-white/15 transition-all duration-200 hover:bg-card/80"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center">
                <Icon size={18} className={`text-gray-400 transition-colors ${accent}`} />
              </div>
              {badge && (
                <span className={`text-xs border rounded-full px-2.5 py-1 font-body ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>
            <h3 className="font-display font-semibold text-white mb-1.5">{title}</h3>
            <p className="text-sm text-gray-500 font-body leading-relaxed">{desc}</p>
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-600 text-center mt-12 font-body">
        MEDLI is an AI assistant and does not provide medical diagnoses. Always consult a qualified doctor.
      </p>
    </div>
  )
}
