// components/wines/BucketWinesList/BucketWinesList.tsx
import WineCard from '../wineCard/WineCard'
import type { WineInBucket } from '../../../types/wine'
import './BucketWinesList.css'

interface BucketRange {
  priceMin: number
  priceMax: number
  pointsMin: number
  pointsMax: number
}

interface BucketWinesListProps {
  wines: WineInBucket[]
  hasMore: boolean
  isLoading?: boolean
  onLoadMore: () => void
  onWineSelect: (id: number) => void
  bucketRange?: BucketRange
  className?: string
}

/**
 * Displays a grid of wines from a selected bucket with pagination
 * Shows price and points range for the current bucket
 */
export const BucketWinesList = ({
  wines,
  hasMore,
  isLoading = false,
  onLoadMore,
  onWineSelect,
  bucketRange,
  className = '',
}: BucketWinesListProps) => {
  if (wines.length === 0) return null

  const formatPriceRange = (min: number, max: number) =>
    `$${min.toFixed(0)}-$${max.toFixed(0)}`

  const formatPointsRange = (min: number, max: number) =>
    `${min.toFixed(1)}-${max.toFixed(1)}`

  return (
    <div className={`bucket-wines-list ${className}`.trim()}>
      {bucketRange && (
        <header className="bucket-header">
          <h3 className="bucket-title">
            Wines in Range:
            <span className="bucket-range">
              {formatPriceRange(bucketRange.priceMin, bucketRange.priceMax)},{' '}
              {formatPointsRange(bucketRange.pointsMin, bucketRange.pointsMax)}{' '}
              points
            </span>
          </h3>
          <p className="bucket-subtitle">
            {wines.length} wine{wines.length !== 1 ? 's' : ''} found
          </p>
        </header>
      )}

      <div className="wines-grid">
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
        <div className="load-more-section">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoading}
            className="load-more-button"
            aria-label={isLoading ? 'Loading more wines...' : 'Load more wines'}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner" aria-hidden="true" />
                Loading...
              </>
            ) : (
              'Load More Wines'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
