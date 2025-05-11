import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRagAnswer,
  fetchWineById,
} from '../../../services/api/wineService.js'
import type { RagAnswerResponse, Wine, RagSource } from '../../../types/wine.js'
import WineCard from '../wineCard/WineCard'
import WineModal from '../wineCard/WineModal.js'

/**
 * SearchWithRag component provides a natural language interface to search
 * wine information using Retrieval Augmented Generation.
 *
 * @returns {JSX.Element} The SearchWithRag component
 */
export default function SearchWithRag() {
  // State for search query and results
  const [query, setQuery] = useState('')
  const [querySubmitted, setQuerySubmitted] = useState(false)
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null)
  const [cachedData, setCachedData] = useState<RagAnswerResponse | null>(null)
  const [isLoadingWine, setIsLoadingWine] = useState<boolean>(false)

  const queryClient = useQueryClient()

  // RAG query mutation using React Query
  const {
    mutate: getRagAnswer,
    data,
    isPending,
    isError,
    error,
  } = useMutation<RagAnswerResponse>({
    mutationKey: ['ragAnswer', query],
    mutationFn: () => fetchRagAnswer(query),
    onSuccess: (response) => {
      setQuerySubmitted(true)
      queryClient.setQueryData(['ragAnswer', query], response)
    },
  })

  /**
   * Fetch complete wine details when a wine card is clicked
   *
   * @param id - Wine ID to fetch (can be number or string)
   */
  const handleOpenWine = async (id: number | string) => {
    try {
      setIsLoadingWine(true)
      // Convert string ID to number if needed
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id
      const wine = await fetchWineById(numericId)
      setSelectedWine(wine)
    } catch (err) {
      console.error('Failed to fetch wine:', err)
    } finally {
      setIsLoadingWine(false)
    }
  }

  // Check for cached results on component mount
  useEffect(() => {
    const cached = queryClient.getQueryData<RagAnswerResponse>([
      'ragAnswer',
      query,
    ])
    if (cached) {
      setCachedData(cached)
      setQuerySubmitted(true)
    }
  }, [query, queryClient]) // Added missing dependencies

  /**
   * Handle form submission to trigger RAG query
   *
   * @param e - Optional form event
   */
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      getRagAnswer()
    }
  }

  // Use data from query or cached results
  const result = data ?? cachedData

  /**
   * Adapt RagSource to match WineSearchResult format
   *
   * @param source - RagSource object to convert
   */
  const adaptSourceToWineSearchResult = (source: RagSource) => ({
    id: typeof source.id === 'string' ? parseInt(source.id, 10) : source.id,
    title: source.title,
    country: source.country,
    variety: source.variety,
    // Add other required fields with defaults
    price: undefined,
    points: undefined,
    winery: undefined,
  })

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="query"
          placeholder="Ask a wine-related question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded border p-2"
        />
        <button
          type="submit"
          className="w-full rounded bg-[rgb(var(--wine-800))] p-2 text-white hover:cursor-pointer hover:brightness-90"
          disabled={isPending}
        >
          {isPending ? 'Searching...' : 'Ask'}
        </button>
      </form>

      {isError && (
        <p className="mt-4 text-red-500">
          {(error as Error)?.message ?? 'Something went wrong.'}
        </p>
      )}

      {querySubmitted && !isPending && !result?.answer && (
        <p className="mt-4 text-gray-500">No answer found.</p>
      )}

      {result?.answer && (
        <div className="mt-6 space-y-6">
          <div className="rounded bg-gray-100 p-4 whitespace-pre-wrap">
            {result.answer}
          </div>

          {result.sources?.length > 0 && (
            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-800">
                Recommended Wine Descriptions:
              </h2>
              <ul className="space-y-2">
                {result.sources.map((source) => (
                  <li key={source.id}>
                    <WineCard
                      wine={adaptSourceToWineSearchResult(source)}
                      onClick={() => handleOpenWine(source.id)}
                      showRatingInfo={false}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {selectedWine && (
        <WineModal wine={selectedWine} onClose={() => setSelectedWine(null)} />
      )}

      {/* Loading indicator for wine details */}
      {isLoadingWine && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20">
          <div className="spinner" />
        </div>
      )}
    </div>
  )
}
