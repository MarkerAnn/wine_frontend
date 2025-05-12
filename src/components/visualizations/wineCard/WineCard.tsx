import type { WineSearchResult } from '../../../types/wine.js'

/**
 * Props interface for the WineCard component
 */
interface WineCardProps {
  wine: WineSearchResult
  onClick?: () => void
  /**
   * Controls if price and points should be displayed
   * @default true
   */
  showRatingInfo?: boolean
}

/**
 * WineCard component displays a summary of wine information in a card format.
 * It can be used in various contexts with different information requirements.
 *
 * @param {WineCardProps} props - Component props
 * @param {WineSearchResult} props.wine - Wine data to display
 * @param {Function} props.onClick - Optional click handler
 * @param {boolean} props.showRatingInfo - Whether to show price and points (default: true)
 * @returns {JSX.Element} The WineCard component
 */
export default function WineCard({
  wine,
  onClick,
  showRatingInfo = true,
}: WineCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="block rounded border p-4 shadow transition-shadow hover:shadow-lg"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <h3 className="text-lg font-bold">{wine.title}</h3>

      <p className="text-gray-600">
        {wine.country ?? 'Unknown country'}
        {wine.variety ? ` — ${wine.variety}` : ''}
      </p>

      {wine.winery && (
        <p className="mt-1 text-sm text-gray-500">{wine.winery}</p>
      )}

      {showRatingInfo && (
        <div className="mt-2">
          {wine.price !== undefined && (
            <p className="text-sm">Price: ${wine.price}</p>
          )}

          {wine.points !== undefined && (
            <p className="text-sm">Points: {wine.points}</p>
          )}
        </div>
      )}
    </div>
  )
}
