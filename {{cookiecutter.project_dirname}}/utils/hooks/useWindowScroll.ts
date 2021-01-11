import { useState, useEffect } from 'react'

export const useWindowScroll = () => {
  const isClient = typeof window === 'object'
  const startScrollY = isClient ? window.scrollY : 0
  const startScrollX = isClient ? window.scrollX : 0

  const [scrollY, setScrollY] = useState(startScrollY)
  const [scrollX, setScrollX] = useState(startScrollX)

  const listener = () => {
    setScrollY(window.scrollY)
    setScrollX(window.scrollX)
  }

  useEffect(() => {
    window.addEventListener('scroll', listener)

    return () => {
      window.removeEventListener('scroll', listener)
    }
  })

  return {
    scrollY,
    scrollX
  }
}
