import { useEffect, useState } from 'react'

// Animates a number from 0 to `end` over `duration` ms, starting after `delay` ms.
export function useCountUp(end, duration = 1200, delay = 300) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf
    let startTime = null

    const tick = (now) => {
      if (!startTime) startTime = now + delay
      if (now < startTime) { raf = requestAnimationFrame(tick); return }

      const t = Math.min((now - startTime) / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(eased * end)

      if (t < 1) raf = requestAnimationFrame(tick)
      else setValue(end)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, duration, delay])

  return value
}
