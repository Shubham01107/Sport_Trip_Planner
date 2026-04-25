import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { selectMatch } from '../store/matchesSlice'

// memo() = memoization (Advanced Feature requirement)
const MatchCard = memo(function MatchCard({ match, isSelected, compact }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const sportColor = {
    cricket: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    football: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  }[match.sport]

  const statusColor = {
    live: 'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-300',
    upcoming: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  }[match.status]

  function handleClick() {
    dispatch(selectMatch(match))
    if (!compact) navigate(`/match/${match.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className={`card p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-accent/40 ${
        isSelected ? 'border-accent border-2 bg-red-50/30 dark:bg-red-900/10' : ''
      } ${compact ? '' : 'hover:-translate-y-0.5'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-snug">{match.teams}</h3>
        {match.status === 'live' && (
          <span className="flex items-center gap-1 text-xs text-red-500 font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{match.description}</p>

      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <span className={`badge ${sportColor}`}>{match.sport}</span>
        <span className={`badge ${statusColor}`}>{match.status}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
          {match.date} · {match.time}
        </span>
      </div>

      <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        📍 {match.venue}, {match.city}
      </div>
    </div>
  )
})

export default MatchCard
