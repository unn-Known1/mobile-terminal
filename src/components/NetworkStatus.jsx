import { useState, useEffect } from 'react'
import { WifiOff, Signal, Zap } from 'lucide-react'

export default function NetworkStatus({ connected, latency, reconnectCount }) {
  const [status, setStatus] = useState('disconnected')

  useEffect(() => {
    if (!connected) {
      setStatus('disconnected')
    } else if (latency < 100) {
      setStatus('excellent')
    } else if (latency < 300) {
      setStatus('good')
    } else if (latency < 500) {
      setStatus('poor')
    } else {
      setStatus('very-poor')
    }
  }, [connected, latency])

  if (!connected) {
    return (
      <div className="network-status disconnected">
        <WifiOff size={14} />
        <span>Offline</span>
      </div>
    )
  }

  const getLatencyColor = () => {
    if (latency < 100) return '#22C55E'
    if (latency < 300) return '#EAB308'
    return '#EF4444'
  }

  return (
    <div className={`network-status ${status}`}>
      <Signal size={14} style={{ color: getLatencyColor() }} />
      <span className="latency">{latency}ms</span>
      {reconnectCount > 0 && (
        <span className="reconnect-badge" title={`Reconnected ${reconnectCount} times`}>
          <Zap size={12} /> {reconnectCount}
        </span>
      )}
    </div>
  )
}
