import { useRef, useMemo } from 'react'

export default function useShallowMemo(fn, deps) {
  const current = useRef(null)
  return useMemo(() => {
    const res = fn()
    const prev = current.current
    if (prev == null) {
      // initialization
      current.current = res
      return res
    }
    // compare with previous one
    const changed =
      prev !== res && Object.keys(res).some((key) => prev[key] !== res[key])
    if (changed) {
      current.current = res
    }
    return current.current
  }, deps)
}
