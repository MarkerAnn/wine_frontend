import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchRagAnswer } from '../../../services/api/wineService.js'
import type { RagAnswerResponse } from '../../../types/wine.js'
import WineCard from '../wineCard/WineCard'

/**
 * SearchWithRag component allows the user to ask a natural language question
 * and receive a generated answer based on wine reviews using RAG (Chroma + LLM).
 *
 * The result is cached using React Query so that the answer persists if the user
 * navigates away and then returns (e.g., using browser back button).
 */
export default function SearchWithRag() {
  const [query, setQuery] = useState('') // user input
  const [querySubmitted, setQuerySubmitted] = useState(false) // track if a search was made
  const [cachedData, setCachedData] = useState<RagAnswerResponse | null>(null) // fallback cache

  const queryClient = useQueryClient()

  // Mutation handles POST request to /api/search/answer
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

      // Manually store the result in React Query's cache
      queryClient.setQueryData(['ragAnswer', query], response)
    },
  })

  // On component mount, check if a previous answer exists in cache
  useEffect(() => {
    const cached = queryClient.getQueryData<RagAnswerResponse>([
      'ragAnswer',
      query,
    ])
    if (cached) {
      setCachedData(cached)
      setQuerySubmitted(true)
    }
  }, [])

  // Form submission handler
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      getRagAnswer()
    }
  }

  // Use either fresh mutation data or cached fallback
  const result = data ?? cachedData

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

      {/* Display error if mutation failed */}
      {isError && (
        <p className="mt-4 text-red-500">
          {(error as Error)?.message ?? 'Something went wrong.'}
        </p>
      )}

      {/* No result message */}
      {querySubmitted && !isPending && !result?.answer && (
        <p className="mt-4 text-gray-500">No answer found.</p>
      )}

      {/* Generated answer and wine suggestions */}
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
                    <WineCard wine={source} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
