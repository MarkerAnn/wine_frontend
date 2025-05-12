import React from 'react'
import './RagSearchForm.css'

interface RagSearchFormProps {
  query: string
  onQueryChange: (query: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  className?: string
}

export const RagSearchForm = ({
  query,
  onQueryChange,
  onSubmit,
  isLoading,
  className = '',
}: RagSearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className={`rag-search-form ${className}`.trim()}>
      <input
        type="text"
        name="query"
        placeholder="Ask a wine-related question..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="rag-search-input"
      />
      <button type="submit" className="rag-search-button" disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Ask'}
      </button>
    </form>
  )
}
