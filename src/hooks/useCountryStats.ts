import { useState, useEffect } from 'react'
import axios from 'axios'

interface VarietyInfo {
  name: string
  count: number
  percentage: number
}

interface CountryStats {
  country: string
  avg_points: number
  count: number
  min_price: number | null
  max_price: number | null
  avg_price: number | null
  top_varieties: VarietyInfo[]
  original_country: string
}

interface CountryStatsResponse {
  items: CountryStats[]
  total_countries: number
}

/**
 * Custom hook for fetching wine country statistics from the API
 *
 * @param {number} minWines - Minimum number of wines per country to include
 * @returns {Object} - Object containing countryStats data, loading state, and error
 */
export const useCountryStats = (
  minWines = 50
): {
  countryStats: CountryStats[]
  loading: boolean
  error: string | null
} => {
  const [countryStats, setCountryStats] = useState<CountryStats[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCountryStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const response = await axios.get<CountryStatsResponse>(
          `${apiUrl}api/stats/countries?min_wines=${minWines}`
        )

        setCountryStats(response.data.items)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching country stats:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchCountryStats()
  }, [minWines])

  return { countryStats, loading, error }
}
