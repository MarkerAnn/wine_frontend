import { useParams } from 'react-router-dom'
import { fetchWineById } from '../../../services/api/wineService.js'
import type { Wine } from '../../../types/wine.js'
import { useQuery } from '@tanstack/react-query'

/**
 * WineDetails component fetches and displays details of a single wine.
 * Uses React Query to fetch wine data based on the wine ID from URL params.
 *
 * @returns {JSX.Element} The WineDetails component
 */
export default function WineDetails() {
  // Get the wine ID from URL params
  const { id } = useParams<{ id: string }>()

  // Use React Query to fetch the wine data
  const {
    data: wine,
    isLoading,
    error,
  } = useQuery<Wine>({
    queryKey: ['wine', id],
    queryFn: () => fetchWineById(Number(id)),
    enabled: !!id, // only run if id is defined
  })

  // Loading state
  if (isLoading) return <p>Loading...</p>

  // Error state
  if (error) return <p className="text-red-500">Failed to load wine details.</p>

  // If no wine found
  if (!wine) return <p>No wine found.</p>

  // Render wine details
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{wine.title}</h1>
      <p className="mt-2">{wine.description}</p>
      <div className="mt-4">
        <p>Points: {wine.points}</p>
        <p>Price: {wine.price ?? 'N/A'}$</p>
        <p>Country: {wine.country}</p>
        <p>Province: {wine.province}</p>
        <p>Region 1: {wine.region_1}</p>
        <p>Region 2: {wine.region_2}</p>
        <p>Winery: {wine.winery}</p>
        <p>Variety: {wine.variety}</p>
      </div>
    </div>
  )
}
