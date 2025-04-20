import { useState, useEffect } from 'react'
import axios from 'axios'

// Define types for our data
export interface WineExample {
  name: string
  price: number
  points: number
  winery: string
}

export interface BucketInfo {
  price_min: number
  price_max: number
  points_min: number
  points_max: number
  count: number
  examples: WineExample[]
}

export interface HeatmapData {
  data: number[][] // [x_index, y_index, value]
  x_categories: number[]
  y_categories: number[]
  bucket_map: { [key: string]: BucketInfo }
  max_count: number
  total_wines: number
  bucket_size: {
    price: number
    points: number
  }
}

export interface HeatmapFilters {
  country?: string
  variety?: string
  minPrice?: number
  maxPrice?: number
  minPoints?: number
  maxPoints?: number
  priceBucketSize?: number
  pointsBucketSize?: number
}

// Extract API base URL
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Custom hook to fetch pre-formatted heatmap data optimized for ECharts visualization
 * Uses server-side processing to reduce client-side computation and network load
 */
export const useHeatmapData = (filters: HeatmapFilters = {}) => {
  const [data, setData] = useState<HeatmapData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Build query parameters
        const params = new URLSearchParams()
        if (filters.country) params.append('country', filters.country)
        if (filters.variety) params.append('variety', filters.variety)
        if (filters.minPrice)
          params.append('min_price', filters.minPrice.toString())
        if (filters.maxPrice)
          params.append('max_price', filters.maxPrice.toString())
        if (filters.minPoints)
          params.append('min_points', filters.minPoints.toString())
        if (filters.maxPoints)
          params.append('max_points', filters.maxPoints.toString())
        if (filters.priceBucketSize)
          params.append('price_bucket_size', filters.priceBucketSize.toString())
        if (filters.pointsBucketSize)
          params.append(
            'points_bucket_size',
            filters.pointsBucketSize.toString()
          )

        const response = await axios.get<HeatmapData>(
          `${apiUrl}/api/stats/price-rating-heatmap?${params.toString()}`
        )

        setData(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching heatmap data:', err)
        setError('Failed to load heatmap data')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters])

  return { data, loading, error }
}
