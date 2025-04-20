import { useEffect, useState } from 'react'

/**
 * Hook för att observera när ett element blir synligt i viewport
 * Används för infinite scroll funktionalitet
 */
const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options = {
    threshold: 0,
    root: null,
    rootMargin: '0px',
  }
): boolean => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
      observer.disconnect()
    }
  }, [elementRef, options])

  return isVisible
}

export default useIntersectionObserver
