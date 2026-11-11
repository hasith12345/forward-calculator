import { animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const [shown, setShown] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const c = animate(prev.current, value, { duration: 0.5, ease: 'easeOut', onUpdate: (v) => { prev.current = v; setShown(v) } })
    return () => c.stop()
  }, [value])
  return <>{format(shown)}</>
}
