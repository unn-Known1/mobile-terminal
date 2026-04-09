import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#EF4444', background: '#1E293B', minHeight: '100vh' }}>
          <h2>Something went wrong</h2>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {this.state.error?.message || this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '10px' }}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
