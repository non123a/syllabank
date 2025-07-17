export default function promisify(f, manyArgs = false) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      function callback(err, ...results) {
        if (err) {
          reject(err)
        } else {
          resolve(manyArgs ? results : results[0])
        }
      }

      args.push(callback)

      f.call(this, ...args)
    })
  }
}
