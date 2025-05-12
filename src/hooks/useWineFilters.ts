import { useQuery } from '@tanstack/react-query'
import {
  fetchCountryList,
  fetchVarietyList,
} from '../services/api/wineService.js'

/**
 * Custom hook for managing wine filter options
 * Fetches and caches country and variety lists
 */
export function useWineFilters() {
  const {
    data: countries = [],
    isLoading: isLoadingCountries,
    error: countriesError,
  } = useQuery({
    queryKey: ['countryList'],
    queryFn: fetchCountryList,
    select: (data): string[] => data ?? [],
  })

  const {
    data: varieties = [],
    isLoading: isLoadingVarieties,
    error: varietiesError,
  } = useQuery({
    queryKey: ['varietyList'],
    queryFn: fetchVarietyList,
    select: (data): string[] => data ?? [],
  })

  return {
    countries,
    varieties,
    isLoading: isLoadingCountries || isLoadingVarieties,
    errors: {
      countries: countriesError,
      varieties: varietiesError,
    },
  }
}
