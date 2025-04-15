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
} from '../../types/wine.js'

// API base URL - should be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/**
 * Handles API errors and provides consistent error messages
 * @param response - Fetch Response object
 * @param customMessage - Optional custom error message
 */
const handleApiError = async (
  response: Response,
  customMessage?: string
): Promise<never> => {
  let errorMessage: string

  try {
    // Try to get error details from response
    const errorData = await response.json()
    errorMessage = errorData.message || errorData.error || response.statusText
  } catch {
    // If response is not JSON, use status text
    errorMessage = response.statusText
  }

  throw new Error(
    customMessage || `API error: ${errorMessage} (${response.status})`
  )
}

/**
 * Fetches wine statistics for the dashboard
 * @returns Wine statistics
 */
export const fetchWineStats = async (): Promise<WineStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wines/stats`)

    if (!response.ok) {
      return handleApiError(response, 'Failed to fetch wine statistics')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching wine stats:', error)
    throw error
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
    // Convert filters object to URL parameters
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    const url = `${API_BASE_URL}/wines?${params.toString()}`
    const response = await fetch(url)

    if (!response.ok) {
      return handleApiError(response, 'Failed to fetch wines')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching wines:', error)
    throw error
  }
}

/**
 * Fetches details for a specific wine
 * @param id - Wine ID
 * @returns Detailed wine information
 */
export const fetchWineById = async (id: number): Promise<Wine> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wines/${id}`)

    if (!response.ok) {
      return handleApiError(response, `Failed to fetch wine #${id}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching wine #${id}:`, error)
    throw error
  }
}

/**
 * Fetches available filter options (countries, types, etc.)
 * @returns Available filter options
 */
export const fetchFilterOptions = async (): Promise<FilterOptions> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wines/filters`)

    if (!response.ok) {
      return handleApiError(response, 'Failed to fetch filter options')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching filter options:', error)
    throw error
  }
}
