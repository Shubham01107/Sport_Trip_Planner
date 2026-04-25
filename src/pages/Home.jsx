import React, { lazy, Suspense, useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchMatches, fetchWeather, setFilter, selectMatch } from '../store/matchesSlice'
import { useDebounce } from '../hooks/useDebounce'
import { ErrorBoundary } from '../components/ErrorBoundary'
import WeatherCard from '../components/WeatherCard'

// Lazy loading (Advanced Feature requirement)
const MatchCard = lazy(() => import('../components/MatchCard'))

const CITIES = ['Mumbai', 'London', 'Manchester', 'Dubai', 'Bengaluru']
const SORT_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'sport', label: 'Sport' },
  { value: 'city', label: 'City' },
]

export default function Home() {
  const dispatch = useDispatch()
  const { list, weather, status, weatherStatus, error, filters, selectedMatch: selMatch } = useSelector((s) => s.matches)
  const currency = useSelector((s) => s.ui.currency)

  const [cityInput, setCityInput] = useState(filters.city)
  const [sportFilter, setSportFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [page, setPage] = useState(1)
  const PER_PAGE = 4

  // Debounced API call — only fires 500ms after user stops typing
  const debouncedCity = useDebounce(cityInput, 500)

  useEffect(() => {
    dispatch(fetchMatches({ city: debouncedCity, sport: sportFilter }))
    dispatch(fetchWeather(debouncedCity))
    setPage(1)
  }, [debouncedCity, sportFilter, dispatch])

  // Filter + sort (client-side)
  const filtered = list
    .filter((m) => statusFilter === 'all' || m.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'date') return a.date.localeCompare(b.date)
      if (sortBy === 'sport') return a.sport.localeCompare(b.sport)
      if (sortBy === 'city') return a.city.localeCompare(b.city)
      return 0
    })

  // Pagination (Advanced Feature)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleSelectMatch = useCallback((match) => {
    dispatch(selectMatch(match))
  }, [dispatch])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-primary rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-accent to-accent2" />
        <div className="relative z-10">
          <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-2">
            Plan Your Trip <span className="text-accent">Around</span> The Game
          </h1>
          <p className="text-white/70 text-lg mb-6">
            Discover upcoming cricket & football matches and build your perfect sports travel itinerary.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/planner" className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Plan a Trip
            </Link>
            <Link to="/dashboard" className="bg-white/10 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-white/20 transition-colors">
              View Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Search + Matches */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filters */}
          <div className="card p-4 space-y-3">
            {/* City search — debounced */}
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Search city (e.g. Mumbai, London, Dubai...)"
              className="input"
            />

            <div className="flex flex-wrap gap-2">
              {/* Sport filter */}
              {['all', 'cricket', 'football'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSportFilter(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize ${
                    sportFilter === s
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary/40'
                  }`}
                >
                  {s === 'all' ? 'All Sports' : s}
                </button>
              ))}

              {/* Status filter */}
              {['all', 'live', 'upcoming'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize ${
                    statusFilter === s
                      ? 'bg-accent text-white border-accent'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-accent/40'
                  }`}
                >
                  {s === 'all' ? 'All Status' : s}
                </button>
              ))}

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input ml-auto w-auto text-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>Sort by {o.label}</option>
                ))}
              </select>
            </div>

            {/* Quick city chips */}
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCityInput(c)}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Match list */}
          <ErrorBoundary>
            {status === 'loading' && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {status === 'failed' && (
              <div className="card p-6 text-center text-red-500">
                <p className="font-semibold">Failed to load matches</p>
                <p className="text-sm mt-1 text-gray-400">{error}</p>
              </div>
            )}

            {status === 'succeeded' && (
              <>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {filtered.length} matches found
                </p>

                <Suspense fallback={<div className="text-center py-8 text-gray-400">Loading...</div>}>
                  <div className="space-y-3">
                    {paginated.length === 0 && (
                      <div className="card p-8 text-center text-gray-400">
                        No matches found. Try a different city or sport.
                      </div>
                    )}
                    {paginated.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        isSelected={selMatch?.id === match.id}
                        compact={false}
                      />
                    ))}
                  </div>
                </Suspense>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          page === p
                            ? 'bg-primary text-white'
                            : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </ErrorBoundary>
        </div>

        {/* Right: Weather */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl tracking-wider">
            Weather in {cityInput || 'Mumbai'}
          </h2>
          {weatherStatus === 'loading' ? (
            <div className="card p-6 animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
            </div>
          ) : (
            <WeatherCard weather={weather} city={cityInput || 'Mumbai'} />
          )}

          {selMatch && (
            <div className="card p-4 border-accent/30 border">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Selected Match</p>
              <p className="font-semibold text-sm">{selMatch.teams}</p>
              <p className="text-xs text-gray-400 mt-1">{selMatch.venue}, {selMatch.city}</p>
              <Link
                to={`/match/${selMatch.id}`}
                className="mt-3 block text-center bg-accent text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Plan Trip for This Match →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
