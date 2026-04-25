import React, { memo } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const WeatherCard = memo(function WeatherCard({ weather, city }) {
  if (!weather) {
    return (
      <div className="card p-6 text-center text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-2">🌤️</p>
        <p className="text-sm">Weather data unavailable</p>
      </div>
    )
  }

  const today = new Date()
  const packingTips = []
  if (weather.temp > 30) packingTips.push('☀️ Sunscreen & light cotton clothing')
  if (weather.humidity > 75) packingTips.push('💧 Stay hydrated — high humidity')
  if (weather.condition?.toLowerCase().includes('rain')) packingTips.push('🌂 Pack a compact umbrella')
  if (weather.temp < 15) packingTips.push('🧥 Bring a warm jacket')
  packingTips.push('👟 Comfortable walking shoes')
  packingTips.push('📱 Stadium e-ticket on your phone')

  return (
    <div className="space-y-4">
      {/* Main weather */}
      <div className="card p-5 flex items-center gap-5">
        <div className="text-6xl leading-none">{weather.icon}</div>
        <div className="flex-1">
          <div className="text-4xl font-display tracking-wider">{weather.temp}°C</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
            {weather.condition}
          </div>
          <div className="flex gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
            <span>Feels {weather.feels}°C</span>
            <span>Humidity {weather.humidity}%</span>
            <span>Wind {weather.wind} km/h</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{city}</div>
        </div>
      </div>

      {/* 5-day forecast */}
      {weather.forecast && (
        <div className="card p-4">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            5-Day Forecast
          </p>
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.map((temp, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {DAYS[(today.getDay() + i) % 7]}
                </div>
                <div className="text-lg my-1">{weather.icon}</div>
                <div className="text-sm font-semibold">{temp}°</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Packing tips */}
      <div className="card p-4">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Packing Tips
        </p>
        <ul className="space-y-2">
          {packingTips.map((tip, i) => (
            <li key={i} className="text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent2 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})

export default WeatherCard
