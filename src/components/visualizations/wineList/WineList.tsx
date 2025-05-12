import WineCard from '../wineCard/WineCard.js'
import { LoadMoreButton } from '../common/loadMoreButton/LoadMoreButton.js'
import type { WineSearchResult } from '../../../types/wine.js'
import './WineList.css'

interface WineListProps {
  wines: WineSearchResult[]
  title?: string
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  onWineSelect: (id: number) => void
  className?: string
}

export const WineList = ({
  wines,
  title,
  hasMore,
  isLoading,
  onLoadMore,
  onWineSelect,
  className = '',
}: WineListProps) => {
  if (wines.length === 0) return null

  return (
    <div className={`wine-list-container ${className}`.trim()}>
      {title && (
        <header className="wine-list-header">
          <h3 className="wine-list-title">{title}</h3>
          <p className="wine-list-count">
            {wines.length} wine{wines.length !== 1 ? 's' : ''} found
          </p>
        </header>
      )}

      <div className="wine-list-grid">
        {wines.map((wine) => (
          <WineCard
            key={wine.id}
            wine={wine}
            onClick={() => onWineSelect(wine.id)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="load-more-section">
          <LoadMoreButton
            onClick={onLoadMore}
            isLoading={isLoading}
            text="Load More Wines"
            loadingText="Loading Wines..."
          />
        </div>
      )}
    </div>
  )
}
