/**
 * API service for wine data
 * Handles all communication with the backend API
 */
import type {
  Wine,
  WineFilters,
  WineListResponse,
  BucketWinesResponse,
  PriceRatingBucket,
  AggregatedPriceRatingResponse,
  WineSearchRequest,
  WineSearchResponse,
  WinesByCountryResponse,
  CountryStatsResponse,
  RagAnswerResponse,
} from '../../types/wine.js'
import axios from 'axios'
import type { AxiosError } from 'axios'

// API base URL - should be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/'

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
// export const fetchWineById = async (id: number): Promise<Wine> => {
//   try {
//     const response = await axios.get<Wine>(`${API_BASE_URL}api/wines/${id}`)

//     return response.data
//   } catch (error) {
//     console.error(`Error fetching wine #${id}:`, error)
//     throw handleApiError(error, `Failed to fetch wine #${id}`)
//   }
// }

export const fetchWineById = async (id: number): Promise<Wine> => {
  try {
    const response = await axios.get<Wine>(`${API_BASE_URL}api/wines/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching wine with ID ${id}:`, error)
    throw handleApiError(error, `Failed to fetch wine with ID ${id}`)
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
  try {
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
  } catch (error) {
    console.error('Error fetching scatter data:', error)
    throw handleApiError(error, 'Failed to fetch scatter data')
  }
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
  try {
    const response = await axios.get(`${API_BASE_URL}api/wines/bucket/`, {
      params: {
        price_min: priceMin,
        price_max: priceMax,
        points_min: pointsMin,
        points_max: pointsMax,
        limit,
        cursor: cursor ?? undefined,
      },
    })

    return response.data
  } catch (error) {
    console.error('Error fetching bucket wines:', error)
    throw handleApiError(error, 'Failed to fetch bucket wines')
  }
}

/**
 * Searches wines based on search criteria.
 *
 * @param searchData - Search parameters (search phrase, country, variety, etc.)
 * @returns List of wines matching the search criteria
 */
export const searchWines = async (
  searchData: WineSearchRequest
): Promise<WineSearchResponse> => {
  try {
    const response = await axios.post<WineSearchResponse>(
      `${API_BASE_URL}api/wines/search`,
      searchData
    )

    return response.data
  } catch (error) {
    console.error('Error searching wines:', error)
    throw handleApiError(error, 'Failed to search wines')
  }
}
/**
 * Fetches the list of available countries
 * @returns Array of country names
 */
export const fetchCountryList = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(
      `${API_BASE_URL}api/stats/country-list`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching country list:', error)
    throw handleApiError(error, 'Failed to fetch country list')
  }
}

/**
 * Fetches the list of available varieties
 * @returns Array of variety names
 */
export const fetchVarietyList = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(
      `${API_BASE_URL}api/wines/variety-list`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching variety list:', error)
    throw handleApiError(error, 'Failed to fetch variety list')
  }
}

/**
 * Fetch wines by country (with pagination support)
 *
 * @param country - Country name
 * @param limit - Number of wines per page (default: 20)
 * @param cursor - Pagination cursor (optional)
 * @returns Wines + pagination info
 */
export const fetchWinesByCountry = async (
  country: string,
  limit = 10,
  cursor?: string | null
): Promise<WinesByCountryResponse> => {
  try {
    const response = await axios.get<WinesByCountryResponse>(
      `${API_BASE_URL}api/wines/by-country/${encodeURIComponent(country)}`,
      {
        params: {
          limit,
          cursor: cursor ?? undefined,
        },
      }
    )

    return response.data
  } catch (error) {
    console.error(`Error fetching wines by country (${country}):`, error)
    throw handleApiError(error, `Failed to fetch wines for ${country}`)
  }
}

/**
 * Fetches wine country statistics from the API
 *
 * @param minWines - Minimum number of wines per country to include
 * @returns Array of CountryStats
 */
export const fetchCountryStats = async (
  minWines = 50
): Promise<CountryStatsResponse> => {
  try {
    const response = await axios.get<CountryStatsResponse>(
      `${API_BASE_URL}api/stats/countries`,
      {
        params: {
          min_wines: minWines,
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('Error fetching country stats:', error)
    throw handleApiError(error, 'Failed to fetch country statistics')
  }
}

/**
 * Fetch RAG answer from the API
 * @param query - Search query
 * @returns RAG answer
 */
export const fetchRagAnswer = async (
  query: string
): Promise<RagAnswerResponse> => {
  try {
    const response = await axios.post<RagAnswerResponse>(
      `${API_BASE_URL}api/search/answer`,
      { query }
    )
    console.log('FETCH RESPONSE', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching RAG answer:', error)
    throw handleApiError(error, 'Failed to fetch RAG answer')
  }
}
