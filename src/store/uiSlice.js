import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('darkMode') === 'true',
    currency: 'INR',
    activeTab: 'trip',
  },
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', state.darkMode)
    },
    setCurrency(state, action) {
      state.currency = action.payload
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload
    },
  },
})

export const { toggleDarkMode, setCurrency, setActiveTab } = uiSlice.actions
export default uiSlice.reducer
