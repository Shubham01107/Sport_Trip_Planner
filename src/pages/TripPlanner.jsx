import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Multi-step form with validation (Advanced Feature requirement)
const STEPS = ['Choose Sport', 'Select City', 'Set Dates', 'Confirm']

const SPORTS = ['Cricket', 'Football', 'Both']
const CITIES = ['Mumbai', 'London', 'Manchester', 'Dubai', 'Bengaluru', 'Other']

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-2 ${i <= step ? 'text-accent' : 'text-gray-300 dark:text-gray-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
              i < step ? 'bg-accent border-accent text-white' :
              i === step ? 'border-accent text-accent' :
              'border-gray-200 dark:border-gray-700 text-gray-400'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className="text-xs hidden sm:block font-medium">{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-8 sm:w-12 ${i < step ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function TripPlanner() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    sport: '',
    city: '',
    customCity: '',
    startDate: '',
    endDate: '',
    guests: 2,
    budget: 'medium',
    notes: '',
  })

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  function validate() {
    const errs = {}
    if (step === 0 && !form.sport) errs.sport = 'Please select a sport'
    if (step === 1 && !form.city) errs.city = 'Please select a city'
    if (step === 2) {
      if (!form.startDate) errs.startDate = 'Start date is required'
      if (!form.endDate) errs.endDate = 'End date is required'
      if (form.startDate && form.endDate && form.endDate < form.startDate)
        errs.endDate = 'End date must be after start date'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function next() {
    if (validate()) setStep((s) => s + 1)
  }

  function back() {
    setStep((s) => s - 1)
  }

  function submit() {
    navigate(`/?city=${form.city || form.customCity}&sport=${form.sport.toLowerCase()}`)
  }

  const finalCity = form.city === 'Other' ? form.customCity : form.city

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl tracking-wider mb-2">Trip Planner</h1>
        <p className="text-gray-400 text-sm">Tell us your preferences and we'll find the perfect match for you</p>
      </div>

      <StepIndicator step={step} />

      <div className="card p-6 min-h-[320px] flex flex-col justify-between">
        <div>
          {/* Step 0: Sport */}
          {step === 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-4">Which sport do you want to watch?</h2>
              <div className="grid grid-cols-3 gap-3">
                {SPORTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => update('sport', s)}
                    className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.sport === s
                        ? 'border-accent bg-accent/5 text-accent'
                        : 'border-gray-200 dark:border-gray-700 hover:border-accent/40'
                    }`}
                  >
                    <div className="text-2xl mb-1">{s === 'Cricket' ? '🏏' : s === 'Football' ? '⚽' : '🎯'}</div>
                    {s}
                  </button>
                ))}
              </div>
              {errors.sport && <p className="text-red-500 text-xs mt-2">{errors.sport}</p>}
            </div>
          )}

          {/* Step 1: City */}
          {step === 1 && (
            <div>
              <h2 className="font-semibold text-lg mb-4">Which city do you want to travel to?</h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => update('city', c)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                      form.city === c
                        ? 'border-accent bg-accent/5 text-accent'
                        : 'border-gray-200 dark:border-gray-700 hover:border-accent/40'
                    }`}
                  >
                    📍 {c}
                  </button>
                ))}
              </div>
              {form.city === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter city name..."
                  value={form.customCity}
                  onChange={(e) => update('customCity', e.target.value)}
                  className="input mt-2"
                />
              )}
              {errors.city && <p className="text-red-500 text-xs mt-2">{errors.city}</p>}
            </div>
          )}

          {/* Step 2: Dates */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg mb-2">When are you planning to travel?</h2>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} className="input" />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">End Date</label>
                <input type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} className="input" />
                {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Number of Guests: {form.guests}</label>
                <input type="range" min="1" max="10" value={form.guests} onChange={(e) => update('guests', Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Budget</label>
                <select value={form.budget} onChange={(e) => update('budget', e.target.value)} className="input">
                  <option value="low">Budget (Under ₹20,000)</option>
                  <option value="medium">Mid-range (₹20,000–₹60,000)</option>
                  <option value="high">Premium (₹60,000+)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <h2 className="font-semibold text-lg mb-4">Confirm your trip preferences</h2>
              <div className="space-y-3">
                {[
                  { label: 'Sport', value: form.sport, icon: '🎯' },
                  { label: 'City', value: finalCity, icon: '📍' },
                  { label: 'Dates', value: form.startDate && form.endDate ? `${form.startDate} → ${form.endDate}` : 'Not set', icon: '📅' },
                  { label: 'Guests', value: `${form.guests} person${form.guests > 1 ? 's' : ''}`, icon: '👥' },
                  { label: 'Budget', value: { low: 'Budget', medium: 'Mid-range', high: 'Premium' }[form.budget], icon: '💰' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800 text-sm">
                    <span className="text-gray-400 flex items-center gap-2">{row.icon} {row.label}</span>
                    <span className="font-medium">{row.value || '—'}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-xs text-gray-400 mb-1 block">Special requests (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                  className="input resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={back}
            disabled={step === 0}
            className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="btn-primary">
              Next →
            </button>
          ) : (
            <button onClick={submit} className="btn-secondary">
              Find Matches 🎯
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
