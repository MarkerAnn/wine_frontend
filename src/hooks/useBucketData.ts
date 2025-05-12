import { useState } from 'react'
import { fetchBucketWines } from '../services/api/wineService.js'
import type { WineSearchResult } from '../types/wine.js'

interface BucketRange {
  priceMin: number | null
  priceMax: number | null
  pointsMin: number | null
  pointsMax: number | null
}

export function useBucketData() {
  const [bucketWines, setBucketWines] = useState<WineSearchResult[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMoreWines, setHasMoreWines] = useState(false)
  const [bucketRange, setBucketRange] = useState<BucketRange | null>(null)

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

    try {
      const result = await fetchBucketWines(
        minPrice,
        maxPrice,
        minPoints,
        maxPoints,
        10
      )
      setBucketWines(
        result.wines.map((wine) => ({
          id: wine.id,
          title: wine.name,
          price: wine.price,
          points: wine.points,
          country: wine.country,
          variety: wine.variety,
          winery: wine.winery,
        }))
      )
      setCursor(result.pagination.next_cursor || null)
      setHasMoreWines(result.pagination.has_next)
    } catch (err) {
      console.error('Failed to fetch bucket wines:', err)
      setBucketWines([])
      setCursor(null)
      setHasMoreWines(false)
    }
  }

  const loadMore = async () => {
    if (!bucketRange || !cursor) return

    try {
      const result = await fetchBucketWines(
        bucketRange.priceMin!,
        bucketRange.priceMax!,
        bucketRange.pointsMin!,
        bucketRange.pointsMax!,
        10,
        cursor
      )

      const newWines = result.wines.map((wine) => ({
        id: wine.id,
        title: wine.name,
        price: wine.price,
        points: wine.points,
        country: wine.country,
        variety: wine.variety,
        winery: wine.winery,
      }))

      setBucketWines((prev) => [...prev, ...newWines])
      setCursor(result.pagination.next_cursor || null)
      setHasMoreWines(result.pagination.has_next)
    } catch (err) {
      console.error('Failed to load more wines:', err)
    }
  }

  return {
    bucketWines,
    hasMoreWines,
    bucketRange,
    loadBucketWines,
    loadMore,
  }
}
