import { useState } from 'react'
import {
  searchWines,
  fetchCountryList,
} from '../../../services/api/wineService'
import type { WineSearchRequest, WineSearchResponse } from '../../../types/wine'
import WineCard from '../wineCard/WineCard'
import { useQuery } from '@tanstack/react-query'

/**
 * SearchWines component allows users to search wines with various filters.
 * It uses React Query to handle searching and fetching country list.
 *
 * @returns {JSX.Element} The SearchWines component
 */
export default function SearchWines() {
  // Form state for search filters
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

  const [searchHasBeenMade, setSearchHasBeenMade] = useState(false)

  // Fetch country list using React Query
  const {
    data: countryList = [],
    isLoading: countriesLoading,
    error: countriesError,
  } = useQuery<string[]>({
    queryKey: ['countryList'],
    queryFn: fetchCountryList,
  })

  // Search wines using React Query - runs manually when form is submitted
  const {
    data: searchResult,
    isLoading: searchLoading,
    error: searchError,
    refetch,
  } = useQuery<WineSearchResponse>({
    queryKey: ['searchWines', formData],
    queryFn: () => searchWines(formData),
    enabled: false, // we control when the query runs
  })

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        value === ''
          ? undefined
          : name.includes('price') || name.includes('points')
            ? Number(value)
            : value,
      page: 1, // Reset to first page on filter change
    }))
  }

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    await refetch()
    setSearchHasBeenMade(true)
  }

  // Handle pagination
  const handlePageChange = async (newPage: number) => {
    setFormData((prev) => ({
      ...prev,
      page: newPage,
    }))
    await refetch()
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
          <select
            name="country"
            value={formData.country ?? ''}
            onChange={handleChange}
            className="w-full rounded border p-2"
            disabled={countriesLoading}
          >
            <option value="">Select country</option>
            {countryList.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
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
          className="w-full rounded bg-[rgb(var(--wine-800))] p-2 text-white hover:cursor-pointer hover:brightness-90"
          disabled={searchLoading}
        >
          {searchLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Errors */}
      {countriesError && (
        <p className="mt-4 text-red-500">Failed to load countries.</p>
      )}
      {searchError && (
        <p className="mt-4 text-red-500">
          Failed to fetch wines. Please try again.
        </p>
      )}

      {/* Search results */}
      <div className="mt-6">
        {(searchResult?.items?.length ?? 0) > 0 ? (
          <ul className="space-y-2">
            {searchResult?.items.map((wine) => (
              <li key={wine.id}>
                <WineCard wine={wine} />
              </li>
            ))}
          </ul>
        ) : (
          searchHasBeenMade &&
          !searchLoading && (
            <p className="mt-4 text-gray-500">No wines found.</p>
          )
        )}
      </div>

      {/* Pagination */}
      {searchResult && searchResult.pages > 1 && (
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => handlePageChange(formData.page - 1)}
            disabled={formData.page === 1 || searchLoading}
            className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            Page {formData.page} of {searchResult.pages}
          </span>
          <button
            type="button"
            onClick={() => handlePageChange(formData.page + 1)}
            disabled={formData.page === searchResult.pages || searchLoading}
            className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
