import { type WineSearchRequest } from '../../../types/wine.js'
import './SearchForm.css'

interface SearchFormProps {
  formData: WineSearchRequest
  onChange: (name: string, value: string | number | undefined) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  countries: string[]
  varieties: string[]
  isFiltersLoading: boolean
}

/**
 * Search form component for wine filtering
 * Handles user input and form submission for wine search
 */
export const SearchForm: React.FC<SearchFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
  countries,
  varieties,
  isFiltersLoading,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    onChange(
      name,
      value === ''
        ? undefined
        : name.includes('price') || name.includes('points')
          ? Number(value)
          : value
    )
  }

  return (
    <form onSubmit={onSubmit} className="search-form">
      <div className="search-input-container">
        <input
          type="text"
          name="search"
          placeholder="Search wines..."
          value={formData.search ?? ''}
          onChange={handleInputChange}
          className="search-input"
        />
      </div>

      <div className="filters-grid">
        <select
          name="country"
          value={formData.country ?? ''}
          onChange={handleInputChange}
          disabled={isFiltersLoading}
          className="filter-select"
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          name="variety"
          value={formData.variety ?? ''}
          onChange={handleInputChange}
          disabled={isFiltersLoading}
          className="filter-select"
        >
          <option value="">Select variety</option>
          {varieties.map((variety) => (
            <option key={variety} value={variety}>
              {variety}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="min_price"
          placeholder="Min Price"
          value={formData.min_price ?? ''}
          onChange={handleInputChange}
          className="filter-input"
        />

        <input
          type="number"
          name="max_price"
          placeholder="Max Price"
          value={formData.max_price ?? ''}
          onChange={handleInputChange}
          className="filter-input"
        />

        <input
          type="number"
          name="min_points"
          placeholder="Min Points"
          value={formData.min_points ?? ''}
          onChange={handleInputChange}
          className="filter-input"
        />
      </div>

      <button type="submit" disabled={isLoading} className="search-button">
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}
