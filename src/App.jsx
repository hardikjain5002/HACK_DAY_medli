import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import SymptomChecker from './pages/SymptomChecker.jsx'
import BookDoctor from './pages/BookDoctor.jsx'
import LabTests from './pages/LabTests.jsx'
import PrescriptionReader from './pages/PrescriptionReader.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="symptoms" element={<SymptomChecker />} />
        <Route path="book-doctor" element={<BookDoctor />} />
        <Route path="lab-tests" element={<LabTests />} />
        <Route path="prescription" element={<PrescriptionReader />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}
