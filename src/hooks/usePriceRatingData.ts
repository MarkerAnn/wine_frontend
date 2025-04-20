import { useState, useEffect } from 'react'
import axios from 'axios'

// Define types for our data
export interface PriceRatingDataPoint {
  id: number
  price: number
  points: number
  country: string
  variety: string
  winery: string
}

export interface PriceRatingResponse {
  data: PriceRatingDataPoint[]
  total: number
  page: number
  page_size: number
}

export interface PriceRatingFilters {
  country?: string
  variety?: string
  minPrice?: number
  maxPrice?: number
  minPoints?: number
  maxPoints?: number
  page?: number
  pageSize?: number
}

// Extract API base URL
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Custom hook to fetch price vs rating data for the scatterplot
 */
export const usePriceRatingData = (filters: PriceRatingFilters = {}) => {
  const [data, setData] = useState<PriceRatingDataPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)

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
        params.append('page', (filters.page || 1).toString())
        params.append('page_size', (filters.pageSize || 1000).toString())

        const response = await axios.get<PriceRatingResponse>(
          `${apiUrl}/api/stats/price-rating?${params.toString()}`
        )

        setData(response.data.data)
        setTotal(response.data.total)
        setError(null)
      } catch (err) {
        console.error('Error fetching price rating data:', err)
        setError('Failed to load data')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters])

  return { data, loading, error, total }
}
