import { useState, useEffect } from 'react'

// Debounce hook — delays updating value until user stops typing
// Used for debounced API calls on search inputs (Advanced Feature requirement)
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
