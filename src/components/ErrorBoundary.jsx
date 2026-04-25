import React from 'react'

// Error Boundary — catches runtime errors and shows fallback UI
// This is one of the Advanced Feature requirements
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Something went wrong
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
