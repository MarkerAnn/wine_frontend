import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchWines } from '../services/api/wineService.js'
import type { WineSearchRequest, WineSearchResponse } from '../types/wine.js'

/**
 * Custom hook for handling wine search functionality
 * Manages search state and query execution
 */
export function useWineSearch() {
  const [searchHasBeenMade, setSearchHasBeenMade] = useState(false)
  const [formData, setFormData] = useState<WineSearchRequest>({
    search: '',
    country: '',
    variety: '',
    min_price: undefined,
    max_price: undefined,
    min_points: undefined,
    page: 1,
    size: 20,
  })

  const {
    data: searchResult,
    isLoading,
    error,
    refetch,
  } = useQuery<WineSearchResponse>({
    queryKey: ['searchWines', formData],
    queryFn: () => searchWines(formData),
    enabled: false,
  })

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    await refetch()
    setSearchHasBeenMade(true)
  }

  return {
    formData,
    setFormData,
    searchResult,
    isLoading,
    error,
    searchHasBeenMade,
    handleSearch,
  }
}
