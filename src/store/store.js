import { configureStore } from '@reduxjs/toolkit'
import matchesReducer from './matchesSlice'
import tripsReducer from './tripsSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    trips: tripsReducer,
    ui: uiReducer,
  },
})
