import { useState } from 'react'
import { searchWines } from '../../../services/api/wineService'
import { WineSearchRequest, WineSearchResult } from '../../../types/wine'

export default function SearchWines() {
  const [formData, setFormData] = useState<WineSearchRequest>({
    search: '',
    country: '',
    variety: '',
    min_price: undefined,
    max_price: undefined,
    min_points: undefined,
    page: 1,
    size: 20,
  })

  const [results, setResults] = useState<WineSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        value === ''
          ? undefined
          : name.includes('price') || name.includes('points')
            ? Number(value)
            : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await searchWines(formData)
      setResults(response.items)
    } catch (err) {
      setError('Failed to fetch wines. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="search"
            placeholder="Search wines..."
            value={formData.search ?? ''}
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country ?? ''}
            onChange={handleChange}
            className="rounded border p-2"
          />
          <input
            type="text"
            name="variety"
            placeholder="Variety"
            value={formData.variety ?? ''}
            onChange={handleChange}
            className="rounded border p-2"
          />
          <input
            type="number"
            name="min_price"
            placeholder="Min Price"
            value={formData.min_price ?? ''}
            onChange={handleChange}
            className="rounded border p-2"
          />
          <input
            type="number"
            name="max_price"
            placeholder="Max Price"
            value={formData.max_price ?? ''}
            onChange={handleChange}
            className="rounded border p-2"
          />
          <input
            type="number"
            name="min_points"
            placeholder="Min Points"
            value={formData.min_points ?? ''}
            onChange={handleChange}
            className="rounded border p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-6">
        {results.length > 0 && (
          <ul className="space-y-2">
            {results.map((wine) => (
              <li key={wine.id} className="rounded border p-4 shadow">
                <h3 className="font-bold">{wine.title}</h3>
                <p>
                  {wine.country} — {wine.variety}
                </p>
                <p>Price: ${wine.price ?? 'N/A'}</p>
                <p>Points: {wine.points}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
