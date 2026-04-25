import axios from 'axios'

// ─── API KEYS ────────────────────────────────────────────────────────────────
// Sign up for free keys at:
//   Cricket: https://cricapi.com  (free tier)
//   Weather: https://openweathermap.org/api  (free tier)
//   Football: https://www.api-football.com  (free tier 100 req/day)
//
// Create a .env file in the root and add:
//   VITE_CRICKET_API_KEY=your_key_here
//   VITE_WEATHER_API_KEY=your_key_here
//   VITE_FOOTBALL_API_KEY=your_key_here
// ─────────────────────────────────────────────────────────────────────────────

const CRICKET_KEY = import.meta.env.VITE_CRICKET_API_KEY
const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY
const FOOTBALL_KEY = import.meta.env.VITE_FOOTBALL_API_KEY

// ── Mock data (used when API keys are not configured) ────────────────────────
const MOCK_MATCHES = [
  {
    id: 1,
    teams: 'India vs Australia',
    sport: 'cricket',
    status: 'upcoming',
    date: '2026-05-02',
    time: '14:30',
    venue: 'Wankhede Stadium',
    city: 'Mumbai',
    capacity: '75,000',
    description: 'ICC Test Series — 1st Test',
  },
  {
    id: 2,
    teams: 'MI vs CSK',
    sport: 'cricket',
    status: 'live',
    date: '2026-04-25',
    time: '19:30',
    venue: 'DY Patil Stadium',
    city: 'Mumbai',
    capacity: '55,000',
    description: 'IPL 2026 — League Match',
  },
  {
    id: 3,
    teams: 'Mumbai City FC vs Bengaluru FC',
    sport: 'football',
    status: 'upcoming',
    date: '2026-05-05',
    time: '20:00',
    venue: 'Mumbai Football Arena',
    city: 'Mumbai',
    capacity: '28,000',
    description: 'ISL 2026 — Playoff',
  },
  {
    id: 4,
    teams: 'England vs India (T20)',
    sport: 'cricket',
    status: 'upcoming',
    date: '2026-05-10',
    time: '18:00',
    venue: 'Edgbaston',
    city: 'London',
    capacity: '25,000',
    description: 'T20 International Series',
  },
  {
    id: 5,
    teams: 'Manchester City vs Arsenal',
    sport: 'football',
    status: 'upcoming',
    date: '2026-05-08',
    time: '16:30',
    venue: 'Etihad Stadium',
    city: 'Manchester',
    capacity: '53,000',
    description: 'Premier League — Matchday 36',
  },
  {
    id: 6,
    teams: 'Pakistan vs Sri Lanka',
    sport: 'cricket',
    status: 'upcoming',
    date: '2026-05-12',
    time: '15:00',
    venue: 'Dubai International Stadium',
    city: 'Dubai',
    capacity: '22,000',
    description: 'Asia Cup 2026 — Group Stage',
  },
  {
    id: 7,
    teams: 'Chelsea vs Liverpool',
    sport: 'football',
    status: 'upcoming',
    date: '2026-05-15',
    time: '17:00',
    venue: 'Stamford Bridge',
    city: 'London',
    capacity: '40,000',
    description: 'Premier League — Matchday 38',
  },
  {
    id: 8,
    teams: 'RCB vs KKR',
    sport: 'cricket',
    status: 'upcoming',
    date: '2026-04-30',
    time: '19:30',
    venue: 'M Chinnaswamy Stadium',
    city: 'Bengaluru',
    capacity: '35,000',
    description: 'IPL 2026 — League Match',
  },
]

const MOCK_WEATHER = {
  Mumbai: { temp: 32, feels: 36, condition: 'Humid & Sunny', humidity: 78, wind: 14, icon: '☀️', forecast: [32, 31, 33, 30, 29] },
  London: { temp: 15, feels: 12, condition: 'Overcast', humidity: 74, wind: 22, icon: '🌥️', forecast: [15, 13, 16, 14, 12] },
  Manchester: { temp: 12, feels: 9, condition: 'Rainy', humidity: 88, wind: 28, icon: '🌧️', forecast: [12, 11, 14, 10, 13] },
  Dubai: { temp: 38, feels: 42, condition: 'Hot & Sunny', humidity: 45, wind: 10, icon: '🔆', forecast: [38, 37, 39, 38, 36] },
  Bengaluru: { temp: 27, feels: 29, condition: 'Partly Cloudy', humidity: 65, wind: 12, icon: '⛅', forecast: [27, 26, 28, 25, 27] },
}

// ── Fetch matches (real API or mock fallback) ─────────────────────────────────
export async function fetchMatchesFromAPI(city = '', sport = 'all') {
  // If no API keys, use mock data
  if (!CRICKET_KEY && !FOOTBALL_KEY) {
    console.warn('No API keys found — using mock data. Add keys to .env to use real data.')
    return filterMock(MOCK_MATCHES, city, sport)
  }

  const results = []

  // ── Fetch cricket matches from CricAPI ───────────────────────────────────
  if ((sport === 'all' || sport === 'cricket') && CRICKET_KEY) {
    try {
      const res = await axios.get('https://cricapi.com/api/matches', {
        params: { apikey: CRICKET_KEY },
      })
      const matches = (res.data.matches || [])
        .filter((m) => m.type !== 'test' || city === '')
        .slice(0, 6)
        .map((m, i) => ({
          id: `cricket_${i}`,
          teams: `${m.team1} vs ${m.team2}`,
          sport: 'cricket',
          status: m.matchStarted ? 'live' : 'upcoming',
          date: m.date?.split('T')[0] || '',
          time: m.date?.split('T')[1]?.slice(0, 5) || '00:00',
          venue: m.venue || 'TBA',
          city: city || 'Various',
          capacity: 'N/A',
          description: m.type || 'Cricket Match',
        }))
      results.push(...matches)
    } catch (e) {
      console.error('CricAPI error:', e.message)
    }
  }

  // ── Fetch football fixtures from API-Football ────────────────────────────
  if ((sport === 'all' || sport === 'football') && FOOTBALL_KEY) {
    try {
      const res = await axios.get('https://v3.football.api-sports.io/fixtures', {
        params: { next: 10 },
        headers: { 'x-apisports-key': FOOTBALL_KEY },
      })
      const fixtures = (res.data.response || []).slice(0, 6).map((f) => ({
        id: `football_${f.fixture.id}`,
        teams: `${f.teams.home.name} vs ${f.teams.away.name}`,
        sport: 'football',
        status: f.fixture.status.short === 'NS' ? 'upcoming' : 'live',
        date: f.fixture.date?.split('T')[0] || '',
        time: f.fixture.date?.split('T')[1]?.slice(0, 5) || '00:00',
        venue: f.fixture.venue?.name || 'TBA',
        city: f.fixture.venue?.city || city,
        capacity: 'N/A',
        description: f.league?.name || 'Football Match',
      }))
      results.push(...fixtures)
    } catch (e) {
      console.error('API-Football error:', e.message)
    }
  }

  // Fall back to mock if API returned nothing
  return results.length > 0 ? results : filterMock(MOCK_MATCHES, city, sport)
}

function filterMock(data, city, sport) {
  return data.filter((m) => {
    const cityMatch = !city || m.city.toLowerCase().includes(city.toLowerCase())
    const sportMatch = sport === 'all' || m.sport === sport
    return cityMatch && sportMatch
  })
}

// ── Fetch weather from OpenWeatherMap ─────────────────────────────────────────
export async function fetchWeatherFromAPI(city) {
  if (!WEATHER_KEY) {
    console.warn('No WEATHER API key — using mock weather.')
    return MOCK_WEATHER[city] || MOCK_WEATHER['Mumbai']
  }

  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: WEATHER_KEY,
        units: 'metric',
      },
    })
    const d = res.data
    return {
      temp: Math.round(d.main.temp),
      feels: Math.round(d.main.feels_like),
      condition: d.weather[0]?.description || '',
      humidity: d.main.humidity,
      wind: Math.round(d.wind.speed * 3.6),
      icon: weatherIcon(d.weather[0]?.main),
      forecast: [d.main.temp, d.main.temp - 1, d.main.temp + 1, d.main.temp - 2, d.main.temp + 2].map(Math.round),
    }
  } catch (e) {
    console.error('Weather API error:', e.message)
    return MOCK_WEATHER[city] || MOCK_WEATHER['Mumbai']
  }
}

function weatherIcon(main) {
  const map = { Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️' }
  return map[main] || '🌤️'
}

// ── Currency conversion ───────────────────────────────────────────────────────
export const CURRENCY_RATES = {
  INR: 1,
  USD: 0.012,
  GBP: 0.0096,
  AED: 0.044,
  EUR: 0.011,
}

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  GBP: '£',
  AED: 'AED ',
  EUR: '€',
}

export function convertCurrency(amountINR, currency) {
  const rate = CURRENCY_RATES[currency] || 1
  const symbol = CURRENCY_SYMBOLS[currency] || '₹'
  const converted = amountINR * rate
  return `${symbol}${converted < 10 ? converted.toFixed(2) : Math.round(converted).toLocaleString('en-IN')}`
}
