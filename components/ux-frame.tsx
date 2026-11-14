'use client'

import { useEffect, useState } from 'react'

const ORIGIN = 'https://ux-heuristic-diagnostic-2qv6.vercel.app'

export function UxFrame() {
  const [height, setHeight] = useState(900)

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== ORIGIN || event.data?.type !== 'ux-diagnostic:height') return
      const next = Number.parseInt(event.data.height, 10)
      if (next > 0) setHeight(next)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return <iframe src={`${ORIGIN}/`} title="Diagnóstico UX/UI Heurístico" allow="clipboard-write" style={{ width: '100%', height, border: 0, display: 'block' }} />
}
