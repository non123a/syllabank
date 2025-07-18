import { useCallback, useRef, useState } from 'react'

export default function useIntersection(options) {
  const [entry, setEntry] = useState(null)

  const observer = useRef(null)

  const ref = useCallback(
    (element) => {
      if (observer.current) {
        observer.current.disconnect()
        observer.current = null
      }

      if (element === null) {
        setEntry(null)
        return
      }

      observer.current = new IntersectionObserver(([_entry]) => {
        setEntry(_entry)
      }, options)

      observer.current.observe(element)
    },
    [options?.rootMargin, options?.root, options?.threshold]
  )

  return { ref, entry }
}
