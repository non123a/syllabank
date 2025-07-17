export default function tap(arr) {
  if (!Array.isArray(arr) || arr.length < 2) {
    throw new Error(
      'tap requires an array with at least two elements: an initial value and one callback'
    )
  }

  const [initialValue, ...callbacks] = arr

  return callbacks.reduce((value, callback) => {
    if (typeof callback !== 'function') {
      throw new Error('All elements after the first must be functions')
    }
    const result = callback(value)
    return result !== undefined ? result : value
  }, initialValue)
}
