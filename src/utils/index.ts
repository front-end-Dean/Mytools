export default function debounce(func: (...args: any[]) => any, wait = 300, immediate = false) {
  let timeout: null | number = null

  return function (this: any, ...args: any[]) {
    const context = this

    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout
    timeout && clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}
