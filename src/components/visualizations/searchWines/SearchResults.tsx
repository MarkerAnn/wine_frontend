import WineCard from '../wineCard/WineCard.js'
import type { WineSearchResult } from '../../../types/wine.js'
import './SearchResults.css'

interface SearchResultsProps {
  items: WineSearchResult[]
  isLoading: boolean
  error: Error | null
  searchHasBeenMade: boolean
  onWineSelect: (id: number) => void
  totalCount?: number
}

/**
 * Displays search results for wines with loading and error states
 * Shows a message when no results are found
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  items,
  isLoading,
  error,
  searchHasBeenMade,
  onWineSelect,
  totalCount,
}) => {
  if (error) {
    return (
      <div className="search-error">
        Failed to fetch wines. Please try again.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="search-loading">
        <div className="loading-spinner" />
        <span>Searching wines...</span>
      </div>
    )
  }

  if (items.length === 0 && searchHasBeenMade) {
    return (
      <div className="no-results">No wines found matching your criteria.</div>
    )
  }

  return (
    <div className="search-results">
      {totalCount !== undefined && (
        <div className="results-count">Found {totalCount} matching wines</div>
      )}

      <ul className="results-list">
        {items.map((wine) => (
          <li key={wine.id} className="result-item">
            <WineCard wine={wine} onClick={() => onWineSelect(wine.id)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
