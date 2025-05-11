import { useState } from 'react'
import { fetchWinesByCountry } from '../services/api/wineService'
import type { WineSearchResult } from '../types/wine'

interface CountryWinesState {
  wines: WineSearchResult[]
  selectedCountry: string | null
  cursor: string | null
  hasMore: boolean
}

/**
 * Custom hook for managing wines from a selected country
 * Handles pagination and data fetching
 */
export function useCountryWines() {
  const [state, setState] = useState<CountryWinesState>({
    wines: [],
    selectedCountry: null,
    cursor: null,
    hasMore: false,
  })

  /**
   * Load wines for a selected country
   * Resets the current state and loads first page
   */
  const loadCountryWines = async (countryName: string) => {
    try {
      // Reset state for new country
      setState((prev) => ({
        ...prev,
        wines: [],
        selectedCountry: countryName,
        cursor: null,
        hasMore: false,
      }))

      const result = await fetchWinesByCountry(countryName, 10)

      setState((prev) => ({
        ...prev,
        wines: result.wines,
        cursor: result.next_cursor || null,
        hasMore: result.has_next,
      }))
    } catch (err) {
      console.error('Failed to fetch wines by country:', err)
      // Reset state on error
      setState((prev) => ({
        ...prev,
        wines: [],
        cursor: null,
        hasMore: false,
      }))
    }
  }

  /**
   * Load more wines for the current country
   * Appends new wines to existing list
   */
  const loadMore = async () => {
    const { selectedCountry, cursor } = state
    if (!selectedCountry || !cursor) return

    try {
      const result = await fetchWinesByCountry(selectedCountry, 20, cursor)

      setState((prev) => ({
        ...prev,
        wines: [...prev.wines, ...result.wines],
        cursor: result.next_cursor || null,
        hasMore: result.has_next,
      }))
    } catch (err) {
      console.error('Failed to load more wines:', err)
    }
  }

  /**
   * Clear current wine selection
   */
  const clearWines = () => {
    setState({
      wines: [],
      selectedCountry: null,
      cursor: null,
      hasMore: false,
    })
  }

  return {
    wines: state.wines,
    selectedCountry: state.selectedCountry,
    hasMore: state.hasMore,
    isLoading: false, // Could add loading state if needed
    loadCountryWines,
    loadMore,
    clearWines,
  }
}
