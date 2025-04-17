// import { useState, useEffect } from 'react'
import type { JSX } from 'react'
import './Dashboard.css'
import WorldMap from '../../components/visualizations/map/WorldMap.js'

/**
 * Dashboard page component - will contain the visualizations
 * @returns {JSX.Element} The Dashboard component
 */
function Dashboard(): JSX.Element {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Wine Dashboard</h1>
      <p className="dashboard-intro">
        Here we will build interactive visualizations for our wine database.
      </p>

      <div className="visualization-placeholder">
        <h2 className="visualization-title">Upcoming Visualizations</h2>
        <ul className="visualization-list">
          <li>Distribution of wines by country</li>
          <li>Price statistics</li>
          <li>Grape popularity</li>
          <li>Comparison of wine types</li>
        </ul>
        <WorldMap />
      </div>
    </div>
  )
}

export default Dashboard

// TODO: Change text here when done
