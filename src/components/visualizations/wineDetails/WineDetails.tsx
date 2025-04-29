import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchWineById } from '../../../services/api/wineService'
import { Wine } from '../../../types/wine'

export default function WineDetails() {
  const { id } = useParams<{ id: string }>()
  const [wine, setWine] = useState<Wine | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWine = async () => {
      setLoading(true)
      try {
        const data = await fetchWineById(Number(id))
        setWine(data)
      } catch (err) {
        setError('Failed to load wine details')
      } finally {
        setLoading(false)
      }
    }

    fetchWine()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (!wine) return <p>No wine found.</p>

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
