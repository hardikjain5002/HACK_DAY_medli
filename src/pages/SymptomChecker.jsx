import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Send, Mic, RotateCcw, Info } from 'lucide-react'
import { sendSymptomMessage, generateVisitSummary } from '../utils/gemini'
import TriageSummaryCard from '../components/TriageSummaryCard'

const QUICK_PROMPTS = [
  'I have a headache and fever since yesterday',
  'मेरे सीने में दर्द है सांस लेने में तकलीफ है',
  'Back pain that gets worse when sitting',
  'Skin rash appeared 2 days ago',
  'Stomach ache and loose motions since morning',
]

const INITIAL_MESSAGE = {
  role: 'model',
  text: "Hi! I'm MEDLI's symptom assistant. Tell me what you're feeling — in English or Hindi, whatever's comfortable. I'll help you figure out which doctor to see.\n\nNote: I'm not a doctor and can't diagnose you. But I can help you prepare for your visit.",
  id: 'init',
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-2 px-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="thinking-dot w-2 h-2 rounded-full bg-brand-400"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  )
}

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} fade-up`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0 mt-1 mr-2">
          <span className="text-brand-400 text-xs font-display font-semibold">M</span>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed ${
          isUser
            ? 'bg-brand-500 text-white rounded-br-sm'
            : 'bg-card border border-border text-gray-200 rounded-bl-sm'
        }`}
      >
        {msg.text.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < msg.text.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SymptomChecker() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [triageSummary, setTriageSummary] = useState(null)
  const [report, setReport] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', text: trimmed, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const { text: aiText, summary } = await sendSymptomMessage(history, trimmed)

      const newHistory = [
        ...history,
        { role: 'user', parts: [{ text: trimmed }] },
        { role: 'model', parts: [{ text: aiText }] },
      ]
      setHistory(newHistory)
      setMessages(prev => [...prev, { role: 'model', text: aiText, id: Date.now() + 1 }])

      if (summary) {
        setTriageSummary(summary)
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'Sorry, I had trouble connecting. Please check your API key in the .env file and try again.',
        id: Date.now() + 1,
        error: true,
      }])
    }

    setLoading(false)
    inputRef.current?.focus()
  }

  const handleGenerateReport = async () => {
    if (!triageSummary || reportLoading) return
    setReportLoading(true)
    try {
      const reportText = await generateVisitSummary(triageSummary)
      setReport(reportText)
    } catch {
      setReport('Could not generate report. Please try again.')
    }
    setReportLoading(false)
  }

  const reset = () => {
    setMessages([INITIAL_MESSAGE])
    setHistory([])
    setTriageSummary(null)
    setReport(null)
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-screen flex flex-col max-w-6xl mx-auto">

      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-display font-semibold text-lg text-white">Symptom Checker</h1>
          <p className="text-xs text-gray-500 font-body">Tell me what you're feeling — AI will suggest the right specialist</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-full px-3 py-1.5 font-body">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            Gemini AI
          </div>
          <button onClick={reset} className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all" title="Start over">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4">

            {/* Quick prompts — show only at start */}
            {messages.length === 1 && (
              <div className="fade-up">
                <p className="text-xs text-gray-500 mb-2.5 font-body">Try one of these:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(p)}
                      className="text-xs bg-card border border-border rounded-full px-3 py-1.5 text-gray-400 hover:text-brand-400 hover:border-brand-500/40 transition-all font-body"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}

            {loading && (
              <div className="flex justify-start fade-up">
                <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0 mt-1 mr-2">
                  <span className="text-brand-400 text-xs font-display font-semibold">M</span>
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                  <ThinkingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border px-4 md:px-6 py-4 flex-shrink-0">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Describe your symptoms... (English या हिंदी में)"
                  rows={1}
                  disabled={loading}
                  className="input-field resize-none leading-relaxed pr-10 min-h-[46px] max-h-32"
                  style={{ overflowY: input.split('\n').length > 2 ? 'auto' : 'hidden' }}
                  onInput={e => {
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                  }}
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-11 h-11 bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center font-body">
              Not a diagnosis — always consult a qualified doctor
            </p>
          </div>
        </div>

        {/* Right panel — triage summary */}
        {(triageSummary || report) && (
          <div className="hidden lg:flex w-80 border-l border-border flex-col p-4 space-y-4 overflow-y-auto flex-shrink-0">
            {triageSummary && (
              <TriageSummaryCard
                summary={triageSummary}
                onGenerateReport={handleGenerateReport}
              />
            )}

            {reportLoading && (
              <div className="card p-4 text-center">
                <ThinkingDots />
                <p className="text-xs text-gray-500 mt-2 font-body">Generating your visit summary...</p>
              </div>
            )}

            {report && (
              <div className="card p-4 fade-up">
                <p className="text-xs text-brand-400 font-display font-semibold uppercase tracking-wide mb-3">Pre-visit Report</p>
                <div className="text-sm text-gray-300 font-body leading-relaxed whitespace-pre-wrap">{report}</div>
                <button
                  onClick={() => {
                    const blob = new Blob([report], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'MEDLI-visit-summary.txt'
                    a.click()
                  }}
                  className="btn-ghost text-xs py-2 mt-3 w-full"
                >
                  Download Summary
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
