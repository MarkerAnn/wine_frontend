import React, { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import WineCard from '../wineCard/WineCard'
import WineModal from '../wineCard/WineModal'
import type {
  WineSearchResult,
  CountryStats,
  CountryStatsResponse,
  Wine,
} from '../../../types/wine.js'
import {
  fetchWinesByCountry,
  fetchCountryStats,
  fetchWineById,
} from '../../../services/api/wineService.js'
import type {
  MapDataItem,
  TooltipParams,
  WorldMapProps,
  EChartsOption,
  ClickEventParams,
} from '../../../types/worldMap.js'
import { useQuery } from '@tanstack/react-query'
import './WorldMap.css'

/**
 * WorldMap component that displays an interactive world map visualization
 * for wine data using Apache ECharts.
 *
 * @returns {JSX.Element} The WorldMap component
 */
const WorldMap: React.FC<WorldMapProps> = ({ onCountrySelect }) => {
  // State for holding ECharts map options
  const [mapOptions, setMapOptions] = useState<EChartsOption | null>(null)

  // React Query to fetch country statistics
  const {
    data: countryStatsResponse,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<CountryStatsResponse>({
    queryKey: ['countryStats'],
    queryFn: () => fetchCountryStats(),
  })

  // State for GeoJSON (map shape) loading/error
  const [geoJsonLoading, setGeoJsonLoading] = useState<boolean>(true)
  const [geoJsonError, setGeoJsonError] = useState<string | null>(null)

  // State for wine data when a country is clicked
  const [countryWines, setCountryWines] = useState<WineSearchResult[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMoreWines, setHasMoreWines] = useState<boolean>(false)
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(
    null
  )

  // State for selected wine and loading state
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null)
  const [isLoadingWine, setIsLoadingWine] = useState<boolean>(false)

  // Fetch and register the GeoJSON map on component mount
  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/data/countries.geo.json')

        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status}`)
        }

        const geoJson = await response.json()

        // Register the map with ECharts
        echarts.registerMap('world', geoJson)
        setGeoJsonLoading(false)
      } catch (err) {
        console.error('Error fetching GeoJSON:', err)
        setGeoJsonError(err instanceof Error ? err.message : 'Unknown error')
        setGeoJsonLoading(false)
      }
    }

    fetchGeoJSON()
  }, [])

  // Update the chart when both GeoJSON and country stats are loaded
  useEffect(() => {
    const countryStats = countryStatsResponse?.items || []

    if (!geoJsonLoading && !statsLoading && countryStats.length > 0) {
      // Prepare map data for ECharts
      const mapData: MapDataItem[] = countryStats.map(
        (country: CountryStats) => ({
          name: country.country,
          value: country.avg_points,
          wineCount: country.count,
          avgPrice: country.avg_price,
          varieties: country.top_varieties,
          originalName: country.original_country,
        })
      )

      // Set up ECharts options
      const options: EChartsOption = {
        backgroundColor: '#fff',
        title: {
          text: 'Global Wine Ratings',
          left: 'center',
          textStyle: {
            color: '#333',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params: TooltipParams): string {
            const data = params.data
            if (!data) return params.name

            // Build tooltip content
            let html = `
              <div style="font-weight:bold;margin-bottom:5px">${params.name}</div>`

            if (data.value !== undefined && data.value !== null) {
              html += `<div>Average Rating: ${data.value.toFixed(1)}</div>`
            } else {
              html += `<div>Average Rating: No data</div>`
            }

            if (data.wineCount !== undefined) {
              html += `<div>Wine Count: ${data.wineCount}</div>`
            }

            if (data.avgPrice) {
              html += `<div>Average Price: $${data.avgPrice.toFixed(2)}</div>`
            }

            if (data.varieties && data.varieties.length > 0) {
              html += `<div style="margin-top:10px"><b>Top Varieties:</b></div>`
              data.varieties.forEach(
                (v: { name: string; percentage: number }) => {
                  html += `<div>${v.name}: ${v.percentage}%</div>`
                }
              )
            }

            return html
          },
        },
        visualMap: {
          left: 'right',
          min: 80,
          max: 95,
          text: ['High Rating', 'Low Rating'],
          calculable: true,
          inRange: {
            color: ['#f2da87', '#cc4025'],
          },
        },
        series: [
          {
            name: 'Wine Ratings',
            type: 'map',
            map: 'world',
            roam: true,
            emphasis: {
              label: {
                show: true,
              },
              itemStyle: {
                areaColor: '#7b68ee',
              },
            },
            data: mapData,
            selectedMode: 'single',
            select: {
              itemStyle: {
                areaColor: '#7b68ee',
              },
            },
          },
        ],
      }

      setMapOptions(options)
    }
  }, [geoJsonLoading, statsLoading, countryStatsResponse])

  // Handle map click events
  const onEvents = {
    click: async (params: ClickEventParams) => {
      if (params.data) {
        const countryName = params.data.name
        onCountrySelect(countryName)
        setSelectedCountryName(countryName)
        setCountryWines([]) // Reset wines on new click
        setCursor(null)
        try {
          const result = await fetchWinesByCountry(countryName, 10)
          setCountryWines(result.wines)
          setCursor(result.next_cursor)
          setHasMoreWines(result.has_next)
        } catch (err) {
          console.error('Failed to fetch wines by country:', err)
        }
      }
    },
  }

  // Load more wines when the user clicks the "Next Page" button
  const loadMoreWines = async (): Promise<void> => {
    if (!selectedCountryName || !cursor) return
    try {
      const result = await fetchWinesByCountry(selectedCountryName, 20, cursor)
      setCountryWines((prev) => [...prev, ...result.wines])
      setCursor(result.next_cursor)
      setHasMoreWines(result.has_next)
    } catch (err) {
      console.error('Failed to load more wines:', err)
    }
  }

  /**
   * Handles selecting a wine and fetching its full details
   *
   * @param id - Wine ID to fetch
   */
  const handleOpenWine = async (id: number) => {
    try {
      setIsLoadingWine(true)
      const wine = await fetchWineById(id)
      setSelectedWine(wine)
    } catch (err) {
      console.error('Failed to fetch wine:', err)
    } finally {
      setIsLoadingWine(false)
    }
  }

  // Handle loading and error states
  if (geoJsonLoading || statsLoading)
    return <div className="loading">Loading map and data...</div>
  if (geoJsonError)
    return <div className="error">Error loading map: {geoJsonError}</div>
  if (statsError)
    return <div className="error">Error loading data: {String(statsError)}</div>
  if (!mapOptions) return <div className="error">No map data available</div>

  return (
    <div className="world-map-container">
      <h2>Wine Producing Countries</h2>
      <p className="mb-2 text-center">
        Choose a country to see more information
      </p>
      <p className="text-center text-sm text-gray-500">
        To make it to the map, the country must have at least 50 wines
      </p>
      {mapOptions && (
        <ReactECharts
          option={mapOptions}
          style={{ height: '600px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          onEvents={onEvents}
        />
      )}
      {countryWines.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-4 text-xl font-semibold">
            Wines from {selectedCountryName}
          </h3>
          <div className="flex flex-col gap-4">
            {countryWines.map((wine) => (
              <WineCard
                key={wine.id}
                wine={{
                  id: wine.id,
                  title: wine.title,
                  country: wine.country,
                  variety: wine.variety,
                  price: wine.price,
                  points: wine.points,
                  winery: wine.winery,
                }}
                onClick={() => handleOpenWine(wine.id)}
              />
            ))}
          </div>

          {hasMoreWines && (
            <div className="load-more-container mt-4">
              <button
                onClick={loadMoreWines}
                type="button"
                className="load-more-button"
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      )}

      {/* Wine detail modal */}
      {selectedWine && (
        <WineModal wine={selectedWine} onClose={() => setSelectedWine(null)} />
      )}

      {/* Loading indicator for wine details */}
      {isLoadingWine && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20">
          <div className="spinner" />
        </div>
      )}
    </div>
  )
}

export default WorldMap
