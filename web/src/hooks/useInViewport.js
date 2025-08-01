import { useEffect, useMemo, useRef, useState } from 'react'

export function useInViewport() {
  const ref = useRef(null)
  const [inViewport, setInViewport] = useState(false)

  const observer = useMemo(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return null
    }
    return new IntersectionObserver(([entry]) =>
      setInViewport(entry.isIntersecting)
    )
  }, [ref])

  useEffect(() => {
    if (ref.current && observer) {
      observer.observe(ref.current)
      return () => observer.disconnect()
    }
    return () => null
  }, [])

  return { ref, inViewport }
}
