// src/pages/dashboard/DashboardPage.tsx

import React, { useState } from 'react'
import type { JSX } from 'react'
import './DashboardPage.css'
import WorldMap from '../../components/visualizations/worldMap/WorldMap'
import WineScatterPlot from '../../components/visualizations/wineScatterPlot/WineScatterPlot.js'

/**
 * DashboardPage
 *
 * This component renders only the world map for wine visualizations.
 * It manages the selected country state and passes it to the WorldMap.
 */
const DashboardPage: React.FC = (): JSX.Element => {
  // State for selected country
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  // Handle country selection
  const handleCountrySelect = (country: string) => {
    setSelectedCountry((prev) => (prev === country ? null : country))
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Wine Dashboard</h1>

      {/* Show selected country filter */}
      {selectedCountry && (
        <div className="filter-indicator">
          Showing data for{' '}
          <strong className="selected-country">{selectedCountry}</strong>
          <button
            className="clear-filter-btn"
            onClick={() => setSelectedCountry(null)}
          >
            Clear filter
          </button>
        </div>
      )}

      <p className="dashboard-intro">
        Explore our interactive wine world map. Click a country to filter.
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
          <h2 className="visualization-title">Wine Scatterplot</h2>
          <WineScatterPlot />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
