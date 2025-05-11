import { useState } from 'react'
import { fetchBucketWines } from '../services/api/wineService.js'
import type { WineInBucket } from '../types/wine.js'

/**
 * Custom hook for managing wine bucket data and pagination
 * Handles fetching and state management for wines within specific price/points ranges
 */
export function useBucketData() {
  const [bucketWines, setBucketWines] = useState<WineInBucket[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMoreWines, setHasMoreWines] = useState<boolean>(false)
  const [bucketRange, setBucketRange] = useState({
    priceMin: null as number | null,
    priceMax: null as number | null,
    pointsMin: null as number | null,
    pointsMax: null as number | null,
  })

  const loadBucketWines = async (price: number, points: number) => {
    const priceRange = 10
    const pointsRange = 1
    const minPrice = Math.floor(price / priceRange) * priceRange
    const maxPrice = minPrice + priceRange
    const minPoints = Math.floor(points / pointsRange) * pointsRange
    const maxPoints = minPoints + pointsRange

    setBucketRange({
      priceMin: minPrice,
      priceMax: maxPrice,
      pointsMin: minPoints,
      pointsMax: maxPoints,
    })
    setCursor(null)

    try {
      const response = await fetchBucketWines(
        minPrice,
        maxPrice,
        minPoints,
        maxPoints,
        10
      )
      setBucketWines(response.wines)
      setCursor(response.pagination.next_cursor || null)
      setHasMoreWines(response.pagination.has_next)
    } catch (err) {
      console.error('Failed to fetch bucket wines:', err)
    }
  }

  return {
    bucketWines,
    hasMoreWines,
    bucketRange,
    loadBucketWines,
    loadMore: async () => {
      if (!bucketRange.priceMin) return

      try {
        const response = await fetchBucketWines(
          bucketRange.priceMin,
          bucketRange.priceMax!,
          bucketRange.pointsMin!,
          bucketRange.pointsMax!,
          10,
          cursor
        )
        setBucketWines((prev) => [...prev, ...response.wines])
        setCursor(response.pagination.next_cursor || null)
        setHasMoreWines(response.pagination.has_next)
      } catch (err) {
        console.error('Failed to load more wines:', err)
      }
    },
  }
}
