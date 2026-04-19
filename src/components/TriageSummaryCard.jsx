import React from 'react'
import { AlertTriangle, Clock, CheckCircle, Stethoscope, FileText, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const urgencyConfig = {
  'Routine':            { color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',  icon: CheckCircle },
  'Soon (within a week)': { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  'Urgent (within 24-48 hrs)': { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: AlertTriangle },
  'Emergency (go now)': { color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20',   icon: AlertTriangle },
}

export default function TriageSummaryCard({ summary, onGenerateReport }) {
  const navigate = useNavigate()
  const urgency = urgencyConfig[summary.URGENCY] || urgencyConfig['Routine']
  const UrgencyIcon = urgency.icon

  return (
    <div className="card p-5 fade-up border-brand-500/30 bg-brand-500/5">
      <div className="flex items-center gap-2 mb-4">
        <Stethoscope size={16} className="text-brand-400" />
        <span className="text-sm font-display font-semibold text-brand-400 tracking-wide uppercase">
          Triage Summary
        </span>
      </div>

      <div className="space-y-3">
        {/* Specialist */}
        <div className="flex justify-between items-start">
          <span className="text-xs text-gray-500 font-body">See a</span>
          <span className="text-sm font-medium text-white font-body text-right">{summary.SPECIALIST}</span>
        </div>

        {/* Urgency */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-body ${urgency.bg}`}>
          <UrgencyIcon size={14} className={urgency.color} />
          <span className={urgency.color}>{summary.URGENCY}</span>
        </div>

        {/* Symptoms */}
        {summary.KEY_SYMPTOMS && (
          <div>
            <p className="text-xs text-gray-500 mb-1.5 font-body">Key symptoms</p>
            <div className="flex flex-wrap gap-1.5">
              {summary.KEY_SYMPTOMS.split(',').map((s, i) => (
                <span key={i} className="text-xs bg-white/5 border border-border rounded-md px-2 py-1 text-gray-300 font-body">
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Prep notes */}
        {summary.PREP_NOTES && (
          <div className="bg-surface rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1 font-body">Tell your doctor</p>
            <p className="text-sm text-gray-300 font-body leading-relaxed">{summary.PREP_NOTES}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => navigate('/book-doctor')}
          className="btn-primary text-sm py-2.5 flex items-center justify-center gap-1.5"
        >
          Book Doctor <ChevronRight size={14} />
        </button>
        <button
          onClick={onGenerateReport}
          className="btn-ghost text-sm py-2.5 flex items-center justify-center gap-1.5"
        >
          <FileText size={14} /> Get Report
        </button>
      </div>

      <p className="text-xs text-gray-600 text-center mt-3 font-body">{summary.DISCLAIMER}</p>
    </div>
  )
}
