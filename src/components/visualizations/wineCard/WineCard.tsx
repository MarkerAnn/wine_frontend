import { Link } from 'react-router-dom'
import type { WineSearchResult } from '../../../types/wine'

interface WineCardProps {
  wine: WineSearchResult
}

export default function WineCard({ wine }: WineCardProps) {
  return (
    <Link
      to={`/wines/${wine.id}`}
      className="block rounded border p-4 shadow transition-shadow hover:shadow-lg"
    >
      <h3 className="text-lg font-bold">{wine.title}</h3>
      <p className="text-gray-600">
        {wine.country ?? 'Unknown country'} —{' '}
        {wine.variety ?? 'Unknown variety'}
      </p>
      <div className="mt-2">
        <p className="text-sm">
          Price: {wine.price !== undefined ? `$${wine.price}` : 'N/A'}
        </p>
        <p className="text-sm">Points: {wine.points}</p>
      </div>
    </Link>
  )
}
