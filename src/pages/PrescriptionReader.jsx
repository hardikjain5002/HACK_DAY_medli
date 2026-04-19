import React from 'react'
import { useState, useRef } from 'react'
import { Upload, FileText, Image, Loader, AlertCircle } from 'lucide-react'
import { readPrescription, readPrescriptionImage } from '../utils/gemini'

export default function PrescriptionReader() {
  const [mode, setMode] = useState('text') // 'text' | 'image'
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const fileRef = useRef()

  const handleTextSubmit = async () => {
    if (!input.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const text = await readPrescription(input)
      setResult(text)
    } catch {
      setResult('Error reading prescription. Please check your API key.')
    }
    setLoading(false)
  }

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImageFile(file)
  }

  const handleImageSubmit = async () => {
    if (!imageFile) return
    setLoading(true)
    setResult(null)
    try {
      const base64 = await fileToBase64(imageFile)
      const text = await readPrescriptionImage(base64, imageFile.type)
      setResult(text)
    } catch {
      setResult('Error reading image. Make sure your API key supports Gemini Vision.')
    }
    setLoading(false)
  }

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl text-white mb-1">Prescription Reader</h1>
        <p className="text-gray-500 text-sm font-body">Upload a prescription image or paste the text. Gemini will explain it in plain language.</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'text', label: 'Paste Text', icon: FileText },
          { id: 'image', label: 'Upload Image', icon: Image },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setMode(id); setResult(null); setImageFile(null); setInput('') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body border transition-all ${
              mode === id
                ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                : 'border-border text-gray-400 hover:text-gray-200 hover:border-white/15'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Input area */}
      {mode === 'text' ? (
        <div className="space-y-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste prescription text here...&#10;e.g. Tab. Azithromycin 500mg 1-0-0 x 3 days&#10;     Syp. Cough Formula 10ml TDS..."
            rows={8}
            className="input-field font-mono text-sm"
          />
          <button
            onClick={handleTextSubmit}
            disabled={!input.trim() || loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-40"
          >
            {loading ? <Loader size={14} className="animate-spin" /> : <FileText size={14} />}
            {loading ? 'Reading...' : 'Read Prescription'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleImageFile(e.dataTransfer.files[0]) }}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-brand-500 bg-brand-500/10'
                : imageFile
                ? 'border-brand-500/40 bg-brand-500/5'
                : 'border-border hover:border-white/20 hover:bg-white/2'
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleImageFile(e.target.files[0])}
            />
            {imageFile ? (
              <>
                <Image size={24} className="text-brand-400 mx-auto mb-3" />
                <p className="text-white font-body text-sm">{imageFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(imageFile.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <Upload size={24} className="text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 font-body text-sm">Drop prescription image here</p>
                <p className="text-xs text-gray-600 mt-1">or click to browse</p>
              </>
            )}
          </div>
          {imageFile && (
            <button
              onClick={handleImageSubmit}
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-40"
            >
              {loading ? <Loader size={14} className="animate-spin" /> : <Image size={14} />}
              {loading ? 'Reading with Gemini Vision...' : 'Read Prescription'}
            </button>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="card p-6 mt-6 fade-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-brand-400" />
            <span className="text-sm font-display font-semibold text-brand-400">Gemini's Explanation</span>
          </div>
          <div className="text-sm text-gray-300 font-body leading-relaxed whitespace-pre-wrap">{result}</div>
          <div className="mt-4 flex items-start gap-2 bg-amber-500/5 border border-amber-500/15 rounded-xl p-3">
            <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-400/80 font-body">Always follow your doctor's instructions. Don't change or stop medicines without consulting them.</p>
          </div>
        </div>
      )}
    </div>
  )
}
