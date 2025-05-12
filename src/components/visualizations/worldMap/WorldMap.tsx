import { useWorldMapData } from '../../../hooks/useWorldMapData.js'
import { useCountryWines } from '../../../hooks/useCountryWines.js'
import { useWineDetails } from '../../../hooks/useWineDetails.js'
import { WorldMapChart } from '../charts/WorldMapChart.js'
import { WineList } from '../wineList/WineList.js'
import { LoadingSpinner } from '../common/loadingSpinner/LoadingSpinner.js'
import WineModal from '../wineCard/WineModal.js'
import type { WorldMapProps } from '../../../types/worldMap.js'
import './WorldMap.css'

/**
 * WorldMap component that displays an interactive visualization
 * of wine data across different countries
 */
export const WorldMap = ({
  onCountrySelect,
  selectedCountry,
  className = '',
}: WorldMapProps) => {
  // Custom hooks for data management
  const {
    mapOptions,
    isLoading: isLoadingMap,
    error: mapError,
  } = useWorldMapData() // Ta bort countryStats eftersom vi inte använder det

  const {
    wines: countryWines,
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
      <WorldMapChart
        options={mapOptions}
        onCountryClick={handleCountryClick}
        selectedCountry={selectedCountry}
      />

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
