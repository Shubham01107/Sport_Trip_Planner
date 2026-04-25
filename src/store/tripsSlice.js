import { createSlice } from '@reduxjs/toolkit'

const tripsSlice = createSlice({
  name: 'trips',
  initialState: {
    saved: JSON.parse(localStorage.getItem('sporttrip_saved') || '[]'),
  },
  reducers: {
    saveTrip(state, action) {
      const exists = state.saved.find((t) => t.id === action.payload.id)
      if (!exists) {
        state.saved.push(action.payload)
        localStorage.setItem('sporttrip_saved', JSON.stringify(state.saved))
      }
    },
    removeTrip(state, action) {
      state.saved = state.saved.filter((t) => t.id !== action.payload)
      localStorage.setItem('sporttrip_saved', JSON.stringify(state.saved))
    },
  },
})

export const { saveTrip, removeTrip } = tripsSlice.actions
export default tripsSlice.reducer
