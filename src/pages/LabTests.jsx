import React, { useState } from 'react'
import { FlaskConical, Info, CheckCircle, Loader, X } from 'lucide-react'
import { MOCK_LAB_TESTS, explainLabTest } from '../utils/gemini'

export default function LabTests() {
  const [cart, setCart] = useState([])
  const [explanation, setExplanation] = useState(null)
  const [explainLoading, setExplainLoading] = useState(false)
  const [booked, setBooked] = useState(false)

  const toggle = (id) => {
    setCart(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleExplain = async (test) => {
    setExplanation({ name: test.name, text: null })
    setExplainLoading(true)
    try {
      const text = await explainLabTest(test.name)
      setExplanation({ name: test.name, text })
    } catch {
      setExplanation({ name: test.name, text: 'Could not load. Check your API key.' })
    }
    setExplainLoading(false)
  }

  const cartItems = MOCK_LAB_TESTS.filter(t => cart.includes(t.id))
  const total = cartItems.reduce((sum, t) => sum + t.price, 0)

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={24} className="text-brand-400" />
          </div>
          <h2 className="font-display font-semibold text-xl text-white mb-2">Tests Booked!</h2>
          <p className="text-gray-400 text-sm font-body mb-4">Visit your nearest lab with your booking reference.</p>
          <div className="bg-surface rounded-xl p-4 mb-4 text-left space-y-1">
            {cartItems.map(t => (
              <div key={t.id} className="flex justify-between text-sm font-body">
                <span className="text-gray-400">{t.name}</span>
                <span className="text-gray-200">₹{t.price}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 mt-2 flex justify-between font-medium text-sm font-body">
              <span className="text-white">Total</span>
              <span className="text-brand-400">₹{total}</span>
            </div>
          </div>
          <button onClick={() => { setBooked(false); setCart([]) }} className="btn-primary w-full">Done</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl text-white mb-1">Lab Tests</h1>
        <p className="text-gray-500 text-sm font-body">Select tests — tap ⓘ to understand what each test checks.</p>
      </div>

      <div className="space-y-2 mb-6">
        {MOCK_LAB_TESTS.map(test => (
          <div
            key={test.id}
            onClick={() => toggle(test.id)}
            className={`card px-4 py-3 flex items-center gap-3 cursor-pointer transition-all hover:border-white/15 ${
              cart.includes(test.id) ? 'border-brand-500/40 bg-brand-500/5' : ''
            }`}
          >
            <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
              cart.includes(test.id) ? 'bg-brand-500 border-brand-500' : 'border-border'
            }`}>
              {cart.includes(test.id) && <CheckCircle size={12} className="text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 font-body">{test.name}</p>
              <p className="text-xs text-gray-500 font-body">{test.duration} results</p>
            </div>
            <span className="text-sm font-medium text-gray-300 font-body">₹{test.price}</span>
            <button
              onClick={e => { e.stopPropagation(); handleExplain(test) }}
              className="p-1.5 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
            >
              <Info size={14} />
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="card p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-body text-white">{cart.length} test{cart.length > 1 ? 's' : ''} selected</p>
            <p className="text-xs text-brand-400 font-body">₹{total}</p>
          </div>
          <button onClick={() => setBooked(true)} className="btn-primary text-sm py-2 px-4">
            Book Now
          </button>
        </div>
      )}

      {explanation && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FlaskConical size={15} className="text-brand-400" />
                <span className="font-display font-semibold text-white text-sm">{explanation.name}</span>
              </div>
              <button onClick={() => setExplanation(null)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
            {explainLoading ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm font-body py-4">
                <Loader size={14} className="animate-spin text-brand-400" />
                Gemini is explaining this test...
              </div>
            ) : (
              <p className="text-sm text-gray-300 font-body leading-relaxed">{explanation.text}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}