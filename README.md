# 🏟️ SportTrip Planner

> Plan your travel around the game — find upcoming cricket & football matches and build your perfect sports trip itinerary.

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React 18 + Vite |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| API Integration | Axios |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Deployment | Vercel / Netlify |

## Advanced Features Implemented

- ✅ Search + filter + sort (city, sport, status, date)
- ✅ Pagination on match listings
- ✅ Dark mode toggle (persisted in localStorage)
- ✅ Debounced API calls on city search input
- ✅ Error boundary implementation
- ✅ Performance optimization with `memo()` and `useMemo()`
- ✅ Dashboard with Recharts (Bar, Pie, Line charts)
- ✅ Multi-step form with validation (Trip Planner)
- ✅ Lazy loading with `React.lazy()` + `Suspense`
- ✅ Currency converter (INR / USD / GBP / AED / EUR)

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation + dark mode
│   ├── MatchCard.jsx       # Memoized match card
│   ├── WeatherCard.jsx     # Weather display + packing tips
│   └── ErrorBoundary.jsx   # Error boundary component
├── pages/
│   ├── Home.jsx            # Main search + match listing
│   ├── Dashboard.jsx       # Charts & statistics
│   ├── TripPlanner.jsx     # Multi-step form
│   ├── MatchDetails.jsx    # Full trip planner per match
│   └── SavedTrips.jsx      # Saved trips management
├── store/
│   ├── store.js            # Redux store setup
│   ├── matchesSlice.js     # Matches + weather state
│   ├── tripsSlice.js       # Saved trips state
│   └── uiSlice.js          # Dark mode + currency
├── hooks/
│   └── useDebounce.js      # Custom debounce hook
└── utils/
    └── api.js              # API calls + mock fallback
```

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/yourusername/sporttrip-planner.git
cd sporttrip-planner
npm install
```

### 2. Set up API keys (optional — works with mock data too)

```bash
cp .env.example .env
```

Edit `.env` and add your free API keys:
- **Cricket**: https://cricapi.com
- **Weather**: https://openweathermap.org/api
- **Football**: https://www.api-football.com

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:5173

### 4. Build for production

```bash
npm run build
```

## Deployment on Vercel

1. Push your code to GitHub
2. Go to https://vercel.com → New Project → Import your repo
3. Add environment variables (your API keys) in Vercel settings
4. Deploy!

## APIs Used

| API | Purpose | Free Tier |
|---|---|---|
| CricAPI | Live & upcoming cricket matches | 100 req/day |
| API-Football | Football fixtures & results | 100 req/day |
| OpenWeatherMap | City weather forecast | 1,000 req/day |

> **Note**: The app works fully offline with realistic mock data if no API keys are provided.

## License

MIT — free to use for your capstone project.
