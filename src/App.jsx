import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import TripPlanner from './pages/TripPlanner'
import MatchDetails from './pages/MatchDetails'
import SavedTrips from './pages/SavedTrips'

export default function App() {
  const darkMode = useSelector((s) => s.ui.darkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/match/:id" element={<MatchDetails />} />
            <Route path="/saved" element={<SavedTrips />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
