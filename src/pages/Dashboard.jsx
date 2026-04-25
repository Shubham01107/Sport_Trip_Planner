import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts'

const COLORS = ['#e94560', '#0f9b58', '#1a1a2e', '#f59e0b', '#3b82f6']

export default function Dashboard() {
  const { list } = useSelector((s) => s.matches)
  const savedTrips = useSelector((s) => s.trips.saved)

  // Derived stats using useMemo (memoization — Advanced Feature)
  const stats = useMemo(() => {
    const bySport = list.reduce((acc, m) => {
      acc[m.sport] = (acc[m.sport] || 0) + 1
      return acc
    }, {})

    const byCity = list.reduce((acc, m) => {
      acc[m.city] = (acc[m.city] || 0) + 1
      return acc
    }, {})

    const byStatus = list.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1
      return acc
    }, {})

    return { bySport, byCity, byStatus }
  }, [list])

  const sportData = Object.entries(stats.bySport).map(([name, value]) => ({ name, value }))
  const cityData = Object.entries(stats.byCity).map(([name, value]) => ({ name, value }))
  const statusData = Object.entries(stats.byStatus).map(([name, value]) => ({ name, Matches: value }))

  // Mock trend data
  const trendData = [
    { month: 'Jan', cricket: 8, football: 5 },
    { month: 'Feb', cricket: 12, football: 8 },
    { month: 'Mar', cricket: 10, football: 12 },
    { month: 'Apr', cricket: 15, football: 9 },
    { month: 'May', cricket: 18, football: 14 },
    { month: 'Jun', cricket: 6, football: 16 },
  ]

  const statCards = [
    { label: 'Total Matches', value: list.length, icon: '🏟️' },
    { label: 'Live Now', value: list.filter((m) => m.status === 'live').length, icon: '🔴' },
    { label: 'Saved Trips', value: savedTrips.length, icon: '💾' },
    { label: 'Cities Covered', value: new Set(list.map((m) => m.city)).size, icon: '🌍' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl tracking-wider mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-3xl font-display tracking-wider">{card.value}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Sport distribution — Pie Chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Matches by Sport
          </h2>
          {sportData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Search for a city to see data</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={sportData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {sportData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Matches by city — Bar Chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Matches by City
          </h2>
          {cityData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Search for a city to see data</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={cityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#e94560" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Trend Line Chart */}
      <div className="card p-5">
        <h2 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Match Trend (2026)
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trendData} margin={{ top: 0, right: 16, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cricket" stroke="#e94560" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="football" stroke="#0f9b58" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
