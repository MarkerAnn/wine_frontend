import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchWineScatterData } from '../services/api/wineService.js'
import type { WineBucket } from '../types/wine.js'

/**
 * Custom hook for managing scatter plot data fetching and processing
 * Handles pagination and data transformation for the scatter plot
 *
 * @returns {Object} Scatter plot data and loading states
 */
export function useScatterData() {
  const {
    data: scatterData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<WineBucket[]>({
    queryKey: ['scatterBuckets'],
    queryFn: ({ pageParam }) => fetchWineScatterData(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 0 ? undefined : allPages.length + 1
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return {
    scatterData: scatterData?.pages.flat() ?? [],
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}
