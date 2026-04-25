import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchMatchesFromAPI, fetchWeatherFromAPI } from '../utils/api'

export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async ({ city, sport }, { rejectWithValue }) => {
    try {
      const data = await fetchMatchesFromAPI(city, sport)
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchWeather = createAsyncThunk(
  'matches/fetchWeather',
  async (city, { rejectWithValue }) => {
    try {
      const data = await fetchWeatherFromAPI(city)
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const matchesSlice = createSlice({
  name: 'matches',
  initialState: {
    list: [],
    weather: null,
    selectedMatch: null,
    status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
    weatherStatus: 'idle',
    error: null,
    filters: {
      sport: 'all',
      status: 'all',
      city: 'Mumbai',
      date: '',
    },
  },
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    selectMatch(state, action) {
      state.selectedMatch = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchWeather.pending, (state) => {
        state.weatherStatus = 'loading'
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.weatherStatus = 'succeeded'
        state.weather = action.payload
      })
      .addCase(fetchWeather.rejected, (state) => {
        state.weatherStatus = 'failed'
      })
  },
})

export const { setFilter, selectMatch, clearError } = matchesSlice.actions
export default matchesSlice.reducer
