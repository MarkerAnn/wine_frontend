import WineCard from './wineCard/WineCard'
import type { WineInBucket } from '../../types/wine.js'
import './BucketWinesList.css'

interface BucketWinesListProps {
  wines: WineInBucket[]
  hasMore: boolean
  isLoading?: boolean
  onLoadMore: () => void
  onWineSelect: (id: number) => void
  bucketRange?: {
    priceMin: number
    priceMax: number
    pointsMin: number
    pointsMax: number
  }
}

/**
 * Displays a list of wines from a selected bucket with pagination
 * Shows price and points range for the current bucket
 */
export const BucketWinesList: React.FC<BucketWinesListProps> = ({
  wines,
  hasMore,
  isLoading = false,
  onLoadMore,
  onWineSelect,
  bucketRange,
}) => {
  if (wines.length === 0) return null

  return (
    <div className="bucket-wines-container mt-6">
      {bucketRange && (
        <h3 className="bucket-range-title mb-4">
          Wines ${bucketRange.priceMin}-${bucketRange.priceMax},
          {bucketRange.pointsMin}-{bucketRange.pointsMax} points
        </h3>
      )}

      <div className="wine-cards-grid">
        {wines.map((wine) => (
          <WineCard
            key={wine.id}
            wine={{
              id: wine.id,
              title: wine.name,
              country: wine.country,
              variety: wine.variety,
              price: wine.price,
              points: wine.points,
              winery: wine.winery,
            }}
            onClick={() => onWineSelect(wine.id)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="load-more-container">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="load-more-button"
          >
            {isLoading ? 'Loading...' : 'Load More Wines'}
          </button>
        </div>
      )}
    </div>
  )
}
