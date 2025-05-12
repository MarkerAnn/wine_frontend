import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchRagAnswer } from '../services/api/wineService.js'
import type { RagAnswerResponse } from '../types/wine.js'

/**
 * Custom hook for handling RAG search functionality
 * Manages search state and query execution
 */
export function useRagSearch() {
  const [query, setQuery] = useState('')
  const [querySubmitted, setQuerySubmitted] = useState(false)
  const [cachedData, setCachedData] = useState<RagAnswerResponse | null>(null)

  const queryClient = useQueryClient()

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

  useEffect(() => {
    const cached = queryClient.getQueryData<RagAnswerResponse>([
      'ragAnswer',
      query,
    ])
    if (cached) {
      setCachedData(cached)
      setQuerySubmitted(true)
    }
  }, [query, queryClient])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      getRagAnswer()
    }
  }

  return {
    query,
    setQuery,
    querySubmitted,
    result: data ?? cachedData,
    isPending,
    isError,
    error,
    handleSubmit,
  }
}
