# MEDLI — Smarter Hospital Visits

> Know which doctor to see before you go.

## Problem
People don't know which specialist to visit when they feel unwell. They go to the wrong doctor, waste time and money. Medical prescriptions are hard to understand.

## Solution
MEDLI uses Google Gemini AI to:
- **Symptom Checker** — Describe symptoms in English or Hindi, get specialist recommendation
- **Doctor Booking** — Browse doctors by specialty, pick a slot
- **Lab Test Booking** — Book tests, AI explains what each test checks
- **Prescription Reader** — Upload prescription image, Gemini explains medicines clearly
- **Pre-visit Summary** — AI generates a report to hand to your doctor

## Tech Stack
- React + Vite
- Tailwind CSS
- Google Gemini 2.5 Flash API
- React Router

## Setup
1. Clone the repo
2. Run `npm install`
3. Create `.env` file and add your Gemini API key:
   `VITE_GEMINI_API_KEY=your_key_here`
4. Run `npm run dev`

## Built for
MLH Hackathon — Built by Hardik Jain

## Disclaimer
MEDLI is not a substitute for professional medical advice. Always consult a qualified doctor.