// ============================================================
// MEDLI — Gemini API Integration
// ============================================================
// Uses @google/generative-ai SDK
// API key: set VITE_GEMINI_API_KEY in your .env file
//
// .env file should look like:
//   VITE_GEMINI_API_KEY=your_actual_key_here
//
// Get your key at: https://aistudio.google.com/app/apikey
// ============================================================

import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  console.warn('⚠️  VITE_GEMINI_API_KEY not set. Add it to your .env file.')
}
const genAI = new GoogleGenerativeAI(API_KEY || 'demo-key')

// Use gemini-1.5-flash — fast, capable, great for hackathons
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

// ─── SYSTEM PROMPTS ─────────────────────────────────────────

const SYMPTOM_SYSTEM_PROMPT = `You are MEDLI's medical triage assistant. Your job is to help patients understand their symptoms and figure out what kind of doctor they should see.

IMPORTANT RULES:
- You are NOT diagnosing. Always make clear you're suggesting which specialist to consult, not what disease they have.
- Be warm, calm, and clear. Avoid medical jargon. If you must use a term, explain it immediately.
- Ask one follow-up question at a time when clarification is needed.
- After gathering enough info (3-5 exchanges), give a TRIAGE SUMMARY.
- Always end serious responses with "Please consult a doctor. This is not a diagnosis."
- Support Hindi mixed with English (Hinglish) naturally.

TRIAGE SUMMARY FORMAT (use when you have enough info):
---TRIAGE_SUMMARY---
SPECIALIST: [type of doctor]
URGENCY: [Routine / Soon (within a week) / Urgent (within 24-48 hrs) / Emergency (go now)]
KEY_SYMPTOMS: [comma separated list]
PREP_NOTES: [what to tell/bring to the doctor]
DISCLAIMER: This is not a diagnosis. Please consult a qualified doctor.
---END_SUMMARY---`

const PRESCRIPTION_SYSTEM_PROMPT = `You are MEDLI's prescription reader. The user will share a prescription image or text.

Your job:
1. List each medicine clearly with its name.
2. Explain in plain language what it's commonly used for.
3. Explain the dosage instructions in simple terms (e.g., "1 tablet after breakfast, 1 after dinner").
4. Flag any important warnings like "avoid alcohol" or "can cause drowsiness."
5. If anything is unclear or unreadable, say so.

Always end with: "Always follow your doctor's instructions. Do not stop or change medicines without consulting them."
Keep it simple enough for someone with no medical background.`

const LAB_EXPLAIN_SYSTEM_PROMPT = `You are MEDLI's lab guide. When given a lab test name, explain:
1. What body function or substance it measures.
2. Why a doctor might order it.
3. How to prepare (fasting? avoid certain foods?).
4. What a result being "high" or "low" might generally indicate (without diagnosing).

Keep it under 150 words. Plain English only.`

// ─── CORE FUNCTIONS ─────────────────────────────────────────

/**
 * Symptom checker — single turn message with history
 * @param {Array} history - [{role: 'user'|'model', parts: [{text}]}]
 * @param {string} userMessage
 * @returns {Promise<{text: string, summary: object|null}>}
 */
export async function sendSymptomMessage(history, userMessage) {
  const chat = model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.4,
    },
  })

  const result = await chat.sendMessage(
    history.length === 0 
      ? `${SYMPTOM_SYSTEM_PROMPT}\n\nUser: ${userMessage}`
      : userMessage
  )
  const text = result.response.text()

  const summary = parseSummary(text)
  const cleanText = summary
    ? text.replace(/---TRIAGE_SUMMARY---[\s\S]*?---END_SUMMARY---/, '').trim()
    : text

  return { text: cleanText, summary }
}

/**
 * Prescription reader — handles text or image
 * @param {string} prescriptionText - raw text from prescription
 * @returns {Promise<string>}
 */
export async function readPrescription(prescriptionText) {
  const prompt = `${PRESCRIPTION_SYSTEM_PROMPT}\n\nPrescription content:\n${prescriptionText}`
  const result = await model.generateContent(prompt)
  return result.response.text()
}

/**
 * Prescription reader with image (Gemini Vision)
 * @param {string} base64Image - base64 encoded image
 * @param {string} mimeType - e.g. 'image/jpeg'
 * @returns {Promise<string>}
 */
export async function readPrescriptionImage(base64Image, mimeType = 'image/jpeg') {
  const result = await model.generateContent([
    PRESCRIPTION_SYSTEM_PROMPT,
    {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    },
    'Please read and explain this prescription.',
  ])
  return result.response.text()
}

/**
 * Explain a lab test in plain language
 * @param {string} testName
 * @returns {Promise<string>}
 */
export async function explainLabTest(testName) {
  const prompt = `${LAB_EXPLAIN_SYSTEM_PROMPT}\n\nExplain this lab test: ${testName}`
  const result = await model.generateContent(prompt)
  return result.response.text()
}

/**
 * Generate a pre-visit doctor summary
 * @param {object} summary - parsed triage summary object
 * @param {string} patientName
 * @returns {Promise<string>}
 */
export async function generateVisitSummary(summary, patientName = 'Patient') {
  const prompt = `Generate a short, professional pre-visit summary for a doctor.

Patient: ${patientName}
Symptoms: ${summary.KEY_SYMPTOMS}
Suggested specialist: ${summary.SPECIALIST}
Urgency: ${summary.URGENCY}
Notes: ${summary.PREP_NOTES}

Format it as a brief clinical note the patient can show their doctor. 
Keep it under 120 words. Use simple bullet points. Start with "Pre-visit summary for [specialist]:"`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

// ─── HELPERS ────────────────────────────────────────────────

function parseSummary(text) {
  const match = text.match(/---TRIAGE_SUMMARY---([\s\S]*?)---END_SUMMARY---/)
  if (!match) return null

  const block = match[1].trim()
  const summary = {}
  const lines = block.split('\n')

  for (const line of lines) {
    const [key, ...rest] = line.split(':')
    if (key && rest.length) {
      summary[key.trim()] = rest.join(':').trim()
    }
  }

  return summary
}

// ─── MOCK DATA (for demo without API key) ───────────────────

export const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Priya Sharma', specialty: 'General Physician', rating: 4.8, slots: ['10:00 AM', '11:30 AM', '2:00 PM'], image: 'PS', color: 'bg-purple-900 text-purple-300' },
  { id: 2, name: 'Dr. Arjun Mehta', specialty: 'Pulmonologist', rating: 4.9, slots: ['9:00 AM', '12:00 PM', '4:30 PM'], image: 'AM', color: 'bg-blue-900 text-blue-300' },
  { id: 3, name: 'Dr. Sunita Rao', specialty: 'Cardiologist', rating: 4.7, slots: ['10:30 AM', '1:00 PM', '3:30 PM'], image: 'SR', color: 'bg-red-900 text-red-300' },
  { id: 4, name: 'Dr. Vikram Patel', specialty: 'Orthopedic', rating: 4.6, slots: ['9:30 AM', '11:00 AM', '2:30 PM'], image: 'VP', color: 'bg-amber-900 text-amber-300' },
  { id: 5, name: 'Dr. Meena Krishnan', specialty: 'Dermatologist', rating: 4.8, slots: ['10:00 AM', '12:30 PM', '3:00 PM'], image: 'MK', color: 'bg-pink-900 text-pink-300' },
  { id: 6, name: 'Dr. Rahul Gupta', specialty: 'Neurologist', rating: 4.9, slots: ['9:00 AM', '11:30 AM', '4:00 PM'], image: 'RG', color: 'bg-teal-900 text-teal-300' },
]

export const MOCK_LAB_TESTS = [
  { id: 1, name: 'Complete Blood Count (CBC)', price: 350, duration: '4-6 hours', common: true },
  { id: 2, name: 'Blood Sugar (Fasting)', price: 120, duration: '2-3 hours', common: true },
  { id: 3, name: 'Lipid Profile', price: 450, duration: '6-8 hours', common: true },
  { id: 4, name: 'Thyroid Function (T3/T4/TSH)', price: 600, duration: '4-6 hours', common: true },
  { id: 5, name: 'Urine Routine', price: 150, duration: '1-2 hours', common: true },
  { id: 6, name: 'Liver Function Test (LFT)', price: 500, duration: '4-6 hours', common: false },
  { id: 7, name: 'Kidney Function Test (KFT)', price: 450, duration: '4-6 hours', common: false },
  { id: 8, name: 'HbA1c (Diabetes 3-month avg)', price: 350, duration: '2-3 hours', common: false },
  { id: 9, name: 'Vitamin D', price: 800, duration: '6-8 hours', common: false },
  { id: 10, name: 'Iron Studies', price: 550, duration: '4-6 hours', common: false },
]
