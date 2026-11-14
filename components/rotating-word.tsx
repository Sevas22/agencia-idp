'use client'

import { useEffect, useState } from 'react'

/** Palabra que cambia en el titular, como en el sitio original. */
export function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), 2200)
    return () => clearInterval(timer)
  }, [words.length])

  return <span className="rotating-word">{words[index]}</span>
}
