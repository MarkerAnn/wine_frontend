import { useState, useMemo } from 'react'
import type { JSX } from 'react'
import './DashboardPage.css'
import WorldMap from '../../components/visualizations/worldMap/WorldMap.js'
import PriceRatingScatter from '../../components/visualizations/priceRatingScatter/PriceRatingScatter.js'
import { usePriceRatingData } from '../../hooks/usePriceRatingData'

function DashboardPage(): JSX.Element {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  // Memoize filters to prevent infinite re-renders
  const filters = useMemo(
    () => ({
      country: selectedCountry || undefined,
      pageSize: 1000,
    }),
    [selectedCountry]
  )

  const {
    data: priceRatingData,
    loading: loadingScatter,
    error,
  } = usePriceRatingData(filters)

  const handleCountrySelect = (country: string) => {
    setSelectedCountry((prev) => (prev === country ? null : country))
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Wine Dashboard</h1>

      {selectedCountry && (
        <div className="filter-indicator">
          Showing data for:{' '}
          <span className="selected-country">{selectedCountry}</span>
          <button
            className="clear-filter-btn"
            onClick={() => setSelectedCountry(null)}
          >
            Clear
          </button>
        </div>
      )}

      <p className="dashboard-intro">
        Explore our interactive wine database visualizations. Select countries
        on the map to filter data across all charts.
      </p>

      <div className="visualizations-grid">
        <div className="visualization-card">
          <h2 className="visualization-title">Global Wine Ratings</h2>
          <WorldMap
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
          />
        </div>

        <div className="visualization-card">
          <h2 className="visualization-title">Price vs. Rating Analysis</h2>
          <PriceRatingScatter data={priceRatingData} loading={loadingScatter} />
        </div>
      </div>

      {error && (
        <div className="mt-4 text-center text-red-500 italic">{error}</div>
      )}

      <div className="visualization-placeholder">
        <h2 className="visualization-title">More Visualizations Coming Soon</h2>
        <ul className="visualization-list">
          <li>Distribution of wines by grape variety</li>
          <li>Price trend analysis</li>
          <li>Regional comparisons</li>
        </ul>
      </div>
    </div>
  )
}

export default DashboardPage

// TODO: Change text here when done
