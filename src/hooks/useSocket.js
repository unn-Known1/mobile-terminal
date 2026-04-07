import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// Shared singleton — all Terminal instances share one connection
let _socket = null
let _refCount = 0
let _latency = 0
let _reconnectCount = 0
let _latencyInterval = null

function getSharedSocket(url) {
  if (!_socket) {
    _socket = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    })

    // Listen for reconnection attempts
    _socket.on('reconnect', (attempt) => {
      _reconnectCount = attempt
    })

    // Periodic latency measurement
    _latencyInterval = setInterval(() => {
      const start = Date.now()
      _socket.emit('ping', () => {
        _latency = Date.now() - start
      })
    }, 5000)
  }
  return _socket
}

export function useSocket(url) {
  const [connected, setConnected] = useState(false)
  const [latency, setLatency] = useState(_latency)
  const [reconnectCount, setReconnectCount] = useState(_reconnectCount)
  const socketRef = useRef(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const socket = getSharedSocket(url)
    socketRef.current = socket
    _refCount++

    // Sync global latency/reconnectCount to local state periodically
    const syncInterval = setInterval(() => {
      setLatency(_latency)
      setReconnectCount(_reconnectCount)
    }, 1000)

    const onConnect = () => { setConnected(true); setTick(n => n + 1) }
    const onDisconnect = () => setConnected(false)

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    if (socket.connected) setConnected(true)

    return () => {
      clearInterval(syncInterval)
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      _refCount--
      if (_refCount === 0 && _socket) {
        _socket.disconnect()
        _socket = null
        if (_latencyInterval) {
          clearInterval(_latencyInterval)
          _latencyInterval = null
        }
      }
    }
  }, [url])

  return { socket: socketRef.current, connected, latency, reconnectCount }
}
