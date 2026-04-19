# MEDLI — Smarter Hospital Visits

> Know which doctor to see before you go.

**MEDLI** is an AI-powered web app that makes hospital visits less confusing. Built with Google Gemini API for MLH Hackathon.

---

## The Problem

When someone feels unwell in India, the first question is always: *"Which doctor do I go to?"* People end up at the wrong specialist, waste money, and lose time. Medical prescriptions are impossible to understand. Lab test reports are jargon-filled. There's no simple tool that bridges this gap.

## The Solution

MEDLI uses Gemini AI to:
1. **Triage your symptoms** — describe how you feel, get told which specialist to see
2. **Read your prescription** — photograph it, get a plain-English explanation
3. **Book a doctor** — browse specialists, pick a slot, confirm
4. **Explain lab tests** — understand what each test checks before you book it
5. **Generate a pre-visit summary** — a clean note you can hand your doctor

Supports **English and Hindi** natively.

---

## Demo

[Add your deployed URL here]

## Screenshots

[Add screenshots here]

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| AI | Google Gemini 1.5 Flash |
| Routing | React Router v6 |
| Deployment | Vercel |

## Gemini Features Used

- **`gemini-1.5-flash`** — symptom triage chat, lab test explanations, pre-visit report generation
- **Gemini Vision** — prescription image reading (multimodal input)
- **Multi-turn chat** — maintains conversation context for symptom follow-up questions
- **Structured output parsing** — extracts triage summary from AI response

---

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/medli.git
cd medli
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your Gemini API key
```bash
cp .env.example .env
```
Then edit `.env` and paste your key:
```
VITE_GEMINI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com/app/apikey)

### 4. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel
```bash
npm install -g vercel
vercel
```
Set `VITE_GEMINI_API_KEY` in your Vercel environment variables.

---

## Project Structure

```
medli/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Sidebar navigation
│   │   └── TriageSummaryCard.jsx # AI triage result card
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing page
│   │   ├── SymptomChecker.jsx  # Main AI chat feature
│   │   ├── BookDoctor.jsx      # Doctor booking
│   │   ├── LabTests.jsx        # Lab test booking + AI explanations
│   │   ├── PrescriptionReader.jsx # Gemini Vision prescription reader
│   │   └── Dashboard.jsx       # User records
│   ├── utils/
│   │   └── gemini.js           # All Gemini API calls in one place
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

---

## How the AI Works

### Symptom Checker
The symptom checker uses a **multi-turn chat** with a carefully crafted system prompt that instructs Gemini to:
- Ask one follow-up question at a time
- Avoid jargon
- Always clarify it is not diagnosing
- Output a structured `TRIAGE_SUMMARY` block after enough context is gathered

The triage summary is parsed from the response and rendered as a visual card with urgency level, recommended specialist, and prep notes.

### Prescription Reader
Uses **Gemini Vision** (`inlineData` with base64 image) to read handwritten or printed prescriptions and explain medicines in plain language.

### Lab Test Explainer
Each test name is sent to Gemini with a focused system prompt that returns a plain-language explanation under 150 words.

---

## Hackathon Notes

- Built for: MLH Hackathon
- Track: Real-world problem solving with Gemini API
- Team: [Your name]
- Time: [Hours spent]

---

## Disclaimer

MEDLI is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
