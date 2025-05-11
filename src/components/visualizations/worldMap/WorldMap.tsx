// components/visualization/WorldMap/WorldMap.tsx
import { useWorldMapData } from '../../../hooks/useWorldMapData'
import { useCountryWines } from '../../../hooks/useCountryWines'
import { useWineDetails } from '../../../hooks/useWineDetails'
import { WorldMapChart } from '../charts/WorldMapChart'
import { WineList } from '../wineList/WineList'
import { LoadingSpinner } from '../common/loadingSpinner/LoadingSpinner'
import WineModal from '../wineCard/WineModal'
import type { WorldMapProps } from '../../../types/worldMap'
import './WorldMap.css'

/**
 * WorldMap component that displays an interactive visualization
 * of wine data across different countries
 */
export const WorldMap = ({
  onCountrySelect,
  className = '',
}: WorldMapProps) => {
  // Custom hooks for data management
  const {
    mapOptions,
    isLoading: isLoadingMap,
    error: mapError,
    countryStats,
  } = useWorldMapData()

  const {
    wines: countryWines,
    selectedCountry,
    hasMore,
    loadCountryWines,
    loadMore,
  } = useCountryWines()

  const { selectedWine, isLoadingWine, handleOpenWine, handleCloseWine } =
    useWineDetails()

  // Handle country selection
  const handleCountryClick = async (countryName: string) => {
    onCountrySelect(countryName)
    await loadCountryWines(countryName)
  }

  // Handle loading and error states
  if (isLoadingMap) {
    return (
      <div className="world-map-loading">
        <LoadingSpinner message="Loading map and data..." />
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="world-map-error">
        Error:{' '}
        {mapError instanceof Error ? mapError.message : 'Failed to load map'}
      </div>
    )
  }

  if (!mapOptions) {
    return <div className="world-map-error">No map data available</div>
  }

  return (
    <div className={`world-map ${className}`.trim()}>
      {/* Map Visualization */}
      <WorldMapChart options={mapOptions} onCountryClick={handleCountryClick} />

      {/* Country Wines List */}
      {countryWines.length > 0 && (
        <section className="country-wines-section">
          <WineList
            wines={countryWines}
            title={`Wines from ${selectedCountry}`}
            hasMore={hasMore}
            isLoading={isLoadingWine}
            onLoadMore={loadMore}
            onWineSelect={handleOpenWine}
          />
        </section>
      )}

      {/* Wine Details Modal */}
      {selectedWine && (
        <WineModal wine={selectedWine} onClose={handleCloseWine} />
      )}

      {/* Loading Overlay */}
      {isLoadingWine && (
        <div className="loading-overlay">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}

export default WorldMap
