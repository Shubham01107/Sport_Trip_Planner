import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeTrip } from '../store/tripsSlice'

export default function SavedTrips() {
  const dispatch = useDispatch()
  const savedTrips = useSelector((s) => s.trips.saved)

  if (savedTrips.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🧳</div>
        <h2 className="text-2xl font-display tracking-wider mb-2">No Saved Trips Yet</h2>
        <p className="text-gray-400 text-sm mb-6">
          Browse matches and save the ones you want to attend.
        </p>
        <Link to="/" className="btn-primary">
          Browse Matches →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-4xl tracking-wider">Saved Trips</h1>
        <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          {savedTrips.length} trip{savedTrips.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedTrips.map((trip) => (
          <div key={trip.id} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{trip.teams}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{trip.description}</p>
              </div>
              <span className={`badge text-xs ${
                trip.sport === 'cricket'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              }`}>
                {trip.sport}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-xs text-gray-400 dark:text-gray-500">
              <p>📅 {trip.date} · {trip.time}</p>
              <p>📍 {trip.venue}, {trip.city}</p>
              {trip.guests && <p>👥 {trip.guests} guest{trip.guests > 1 ? 's' : ''} · {trip.nights} nights</p>}
              <p className="text-gray-300 dark:text-gray-600">Saved {new Date(trip.savedAt).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <Link
                to={`/match/${trip.id}`}
                className="flex-1 text-center py-2 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                View Details
              </Link>
              <button
                onClick={() => dispatch(removeTrip(trip.id))}
                className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-500 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
