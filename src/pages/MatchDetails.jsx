import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveTrip } from '../store/tripsSlice'
import { setCurrency } from '../store/uiSlice'
import { convertCurrency, CURRENCY_RATES } from '../utils/api'
import WeatherCard from '../components/WeatherCard'

const ATTRACTIONS = {
  Mumbai: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Juhu Beach', 'Bandra Bandstand', 'Dharavi Tour'],
  London: ['Tower of London', 'Hyde Park', 'Covent Garden', 'British Museum', 'Thames Embankment', 'Camden Market'],
  Manchester: ['Trafford Centre', 'Northern Quarter', 'John Rylands Library', 'Heaton Park', 'Salford Quays', 'The Lowry'],
  Dubai: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Gold Souk', 'Desert Safari', 'Dubai Creek'],
  Bengaluru: ['Lalbagh Garden', 'Cubbon Park', 'UB City', 'ISKCON Temple', 'Brigade Road', 'Nandi Hills'],
}

const HOTELS = {
  Mumbai: ['Taj Mahal Palace — ₹18,000/night', 'ITC Maratha — ₹12,000/night', 'Trident Nariman Point — ₹9,500/night'],
  London: ['The Savoy — £450/night', "Claridge's — £380/night", 'Hotel Cafe Royal — £320/night'],
  Manchester: ['The Midland — £180/night', 'King Street Townhouse — £220/night', 'Gotham Hotel — £160/night'],
  Dubai: ['Atlantis The Palm — AED 2,200/night', 'Burj Al Arab — AED 5,500/night', 'Address Downtown — AED 1,800/night'],
  Bengaluru: ['Leela Palace — ₹14,000/night', 'ITC Windsor — ₹9,000/night', 'Taj West End — ₹11,000/night'],
}

const COSTS = {
  ticket: 2500,
  hotel: 8500,
  flight: 12000,
  food: 1500,
  transport: 800,
}

const TABS = ['Overview', 'Weather', 'Itinerary', 'Budget']

export default function MatchDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { list, weather } = useSelector((s) => s.matches)
  const currency = useSelector((s) => s.ui.currency)
  const savedTrips = useSelector((s) => s.trips.saved)

  const [activeTab, setActiveTab] = useState('Overview')
  const [guests, setGuests] = useState(2)
  const [nights, setNights] = useState(3)
  const [saved, setSaved] = useState(false)

  const match = useMemo(() => list.find((m) => String(m.id) === String(id)), [list, id])

  if (!match) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">🏟️</p>
        <h2 className="text-xl font-semibold mb-2">Match not found</h2>
        <p className="text-gray-400 mb-6 text-sm">Go back and select a match first.</p>
        <button onClick={() => navigate('/')} className="btn-primary">← Back to matches</button>
      </div>
    )
  }

  const city = match.city
  const atts = ATTRACTIONS[city] || ['City Center', 'Local Market', 'Historic Museum', 'Waterfront']
  const hotels = HOTELS[city] || ['Grand Hotel', 'City Inn', 'Stadium Lodge']

  const totalCost = useMemo(() => ({
    ticket: COSTS.ticket * guests,
    hotel: COSTS.hotel * nights * guests,
    flight: COSTS.flight * guests,
    food: COSTS.food * nights * guests,
    transport: COSTS.transport * nights,
    get total() { return this.ticket + this.hotel + this.flight + this.food + this.transport },
  }), [guests, nights])

  const itinerary = [
    { day: 'Day 1', color: 'blue', steps: [`Arrive in ${city}`, `Check in: ${hotels[0]?.split('—')[0]}`, `Evening: ${atts[0]}`] },
    { day: 'Day 2', color: 'green', steps: [`Morning: ${atts[1]}`, `Lunch at local restaurant`, `Explore ${atts[2]}`] },
    { day: 'Day 3', color: 'red', steps: [`🏟️ MATCH DAY: ${match.teams}`, `Pre-match: ${atts[3] || 'Stadium tour'}`, `Post-match celebration dinner`] },
    { day: 'Day 4', color: 'gray', steps: [`Morning: ${atts[4] || 'Shopping'}`, `${atts[5] || 'City walk'}`, `Depart — Safe travels!`] },
  ]

  function handleSave() {
    dispatch(saveTrip({ ...match, savedAt: new Date().toISOString(), guests, nights }))
    setSaved(true)
  }

  const isAlreadySaved = savedTrips.some((t) => String(t.id) === String(id))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-primary text-white rounded-2xl p-6 mb-6">
        <button onClick={() => navigate(-1)} className="text-white/60 text-sm hover:text-white mb-3 flex items-center gap-1">
          ← Back
        </button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl tracking-wider">{match.teams}</h1>
            <p className="text-white/60 mt-1">{match.description}</p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-white/70">
              <span>📅 {match.date} · {match.time}</span>
              <span>📍 {match.venue}, {city}</span>
              <span>👥 Capacity: {match.capacity}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isAlreadySaved || saved}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${
                isAlreadySaved || saved
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-accent2 text-white hover:opacity-90'
              }`}
            >
              {isAlreadySaved || saved ? '✓ Saved' : '+ Save Trip'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 dark:border-gray-800 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold mb-3">Nearby Attractions</h3>
              <div className="grid grid-cols-2 gap-3">
                {atts.map((a, i) => (
                  <div key={a} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-sm font-medium">{a}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{(1.2 + i * 0.7).toFixed(1)} km away</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold mb-3">Recommended Hotels</h3>
              <ul className="space-y-2">
                {hotels.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm">
                    <span className="text-accent2">★</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold mb-3">Head-to-Head Stats</h3>
            {[
              { label: match.teams.split(' vs ')[0] + ' wins', value: 14, max: 26, color: '#e94560' },
              { label: 'Draws / No result', value: 3, max: 26, color: '#6b7280' },
              { label: match.teams.split(' vs ')[1] + ' wins', value: 9, max: 26, color: '#378add' },
            ].map((row) => (
              <div key={row.label} className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${(row.value / row.max) * 100}%`, background: row.color }}
                  />
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 space-y-1">
              <p>🏟️ Home win rate at {match.venue}: 64%</p>
              <p>🎟️ Best seats: North Stand, Upper Tier</p>
              <p>📈 Avg resale: 1.8× face value</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Weather' && (
        <WeatherCard weather={weather} city={city} />
      )}

      {activeTab === 'Itinerary' && (
        <div className="space-y-4">
          {itinerary.map((day, di) => (
            <div key={di} className="card p-5">
              <h3 className={`font-display text-xl tracking-wider mb-3 ${
                day.color === 'red' ? 'text-accent' : day.color === 'green' ? 'text-accent2' : ''
              }`}>
                {day.day} {day.color === 'red' && '🏟️'}
              </h3>
              <ul className="space-y-2">
                {day.steps.map((step, si) => (
                  <li key={si} className="flex items-center gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      day.color === 'red' ? 'bg-accent' : day.color === 'green' ? 'bg-accent2' : day.color === 'blue' ? 'bg-blue-400' : 'bg-gray-300'
                    }`} />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Budget' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="card p-5 flex flex-wrap gap-6">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Guests</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-lg">−</button>
                <span className="font-semibold w-6 text-center">{guests}</span>
                <button onClick={() => setGuests(g => Math.min(10, g + 1))} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-lg">+</button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Nights</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setNights(n => Math.max(1, n - 1))} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-lg">−</button>
                <span className="font-semibold w-6 text-center">{nights}</span>
                <button onClick={() => setNights(n => Math.min(14, n + 1))} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-lg">+</button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => dispatch(setCurrency(e.target.value))}
                className="input w-auto"
              >
                {Object.keys(CURRENCY_RATES).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Cost Breakdown ({guests} guest{guests > 1 ? 's' : ''}, {nights} nights)</h3>
            {[
              { label: 'Match Tickets', amount: totalCost.ticket },
              { label: 'Hotel', amount: totalCost.hotel },
              { label: 'Flights (est.)', amount: totalCost.flight },
              { label: 'Food & Dining', amount: totalCost.food },
              { label: 'Local Transport', amount: totalCost.transport },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2.5 border-b border-gray-50 dark:border-gray-800 text-sm">
                <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                <span className="font-medium">{convertCurrency(item.amount, currency)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 font-semibold text-base">
              <span>Total Estimate</span>
              <span className="text-accent text-lg">{convertCurrency(totalCost.total, currency)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
