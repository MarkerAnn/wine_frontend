/**
 * API service for wine data
 * Handles all communication with the backend API
 */
import type {
  Wine,
  WineFilters,
  WineStats,
  WineListResponse,
  FilterOptions,
  HeatmapResponse,
  BucketWinesResponse,
  PriceRatingBucket,
  AggregatedPriceRatingResponse,
} from '../../types/wine.js'
import axios from 'axios'
import type { AxiosError } from 'axios'

// API base URL - should be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/'

/**
 * Handles API errors and provides consistent error messages
 * @param error - Axios error object
 * @param customMessage - Optional custom error message
 */
const handleApiError = (error: unknown, customMessage?: string): never => {
  let errorMessage: string

  // Check if error is an AxiosError
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError
    if (axiosError.response) {
      try {
        // Try to get error details from response
        const errorData = axiosError.response.data as {
          message?: string
          error?: string
        }
        errorMessage =
          errorData.message || errorData.error || axiosError.response.statusText
      } catch {
        // If response data cannot be processed
        errorMessage = axiosError.response.statusText
      }
    } else if (axiosError.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server'
    } else {
      // Something happened in setting up the request
      errorMessage = axiosError.message
    }
  } else {
    // If error is not an AxiosError, use a default error message
    errorMessage = (error as Error).message || 'Unknown error'
  }

  throw new Error(customMessage || `API error: ${errorMessage}`)
}

/**
 * Fetches wine statistics for the dashboard
 * @returns Wine statistics
 */
export const fetchWineStats = async (): Promise<WineStats> => {
  try {
    const response = await axios.get<WineStats>(
      `${API_BASE_URL}api/wines/stats`
    )

    return response.data
  } catch (error) {
    console.error('Error fetching wine stats:', error)
    throw handleApiError(error, 'Failed to fetch wine statistics')
  }
}

/**
 * Fetches wines based on provided filters
 * @param filters - Filter criteria (country, type, price range, etc.)
 * @returns List of wines matching the filters and metadata
 */
export const fetchWines = async (
  filters: WineFilters = {}
): Promise<WineListResponse> => {
  try {
    // Convert filters object to params object
    // Only include defined values
    const params: Record<string, string | number | boolean> = {}

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value
      }
    })

    const response = await axios.get<WineListResponse>(
      `${API_BASE_URL}api/wines`,
      { params }
    )

    return response.data
  } catch (error) {
    console.error('Error fetching wines:', error)
    throw handleApiError(error, 'Failed to fetch wines')
  }
}

/**
 * Fetches details for a specific wine
 * @param id - Wine ID
 * @returns Detailed wine information
 */
export const fetchWineById = async (id: number): Promise<Wine> => {
  try {
    const response = await axios.get<Wine>(`${API_BASE_URL}api/wines/${id}`)

    return response.data
  } catch (error) {
    console.error(`Error fetching wine #${id}:`, error)
    throw handleApiError(error, `Failed to fetch wine #${id}`)
  }
}

/**
 * Fetches available filter options (countries, types, etc.)
 * @returns Available filter options
 */
export const fetchFilterOptions = async (): Promise<FilterOptions> => {
  try {
    const response = await axios.get<FilterOptions>(
      `${API_BASE_URL}api/wines/filters`
    )

    return response.data
  } catch (error) {
    console.error('Error fetching filter options:', error)
    throw handleApiError(error, 'Failed to fetch filter options')
  }
}

/**
 * Fetches the pre-binned heatmap data for price vs. rating.
 *
 * @param priceBucketSize how wide each price bucket is (e.g. 10)
 * @param pointsBucketSize how tall each points bucket is (e.g. 1)
 * @param filters optional country/variety/min/max filters
 */
export async function fetchHeatmap(params: {
  priceBucketSize?: number
  pointsBucketSize?: number
  country?: string
  variety?: string
  minPrice?: number
  maxPrice?: number
  minPoints?: number
  maxPoints?: number
}): Promise<HeatmapResponse> {
  try {
    const response = await axios.get<HeatmapResponse>(
      `${API_BASE_URL}api/stats/price-rating-heatmap`,
      {
        params: {
          price_bucket_size: params.priceBucketSize,
          points_bucket_size: params.pointsBucketSize,
          country: params.country,
          variety: params.variety,
          min_price: params.minPrice,
          max_price: params.maxPrice,
          min_points: params.minPoints,
          max_points: params.maxPoints,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching heatmap data:', error)
    throw handleApiError(error, 'Failed to fetch heatmap data')
  }
}
/**
 * Fetch sample wine data for scatterplot
 *
 * @returns {Promise<WineScatterPoint[]>} Array of wine points
 */
export const fetchWineScatterData = async (
  page: number
): Promise<PriceRatingBucket[]> => {
  const response = await axios.get<AggregatedPriceRatingResponse>(
    `${API_BASE_URL}api/stats/price-rating-aggregated`,
    {
      params: {
        page,
        page_size: 300,
      },
    }
  )

  console.log('FETCH RESPONSE', response.data)

  return response.data.buckets
}

/**
 * Fetch wines in a specific price/points bucket.
 *
 * @param priceMin - Minimum price
 * @param priceMax - Maximum price
 * @param pointsMin - Minimum points
 * @param pointsMax - Maximum points
 * @param limit - Number of wines to fetch (default 10)
 */
export const fetchBucketWines = async (
  priceMin: number,
  priceMax: number,
  pointsMin: number,
  pointsMax: number,
  limit = 10,
  cursor?: string | null
): Promise<BucketWinesResponse> => {
  const response = await axios.get(`${API_BASE_URL}api/wines/bucket/`, {
    params: {
      price_min: priceMin,
      price_max: priceMax,
      points_min: pointsMin,
      points_max: pointsMax,
      limit,
      cursor: cursor ?? undefined, // If cursor is not provided, it will be undefined
    },
  })

  return response.data
}
