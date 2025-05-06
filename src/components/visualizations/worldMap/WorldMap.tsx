import React, { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { useCountryStats } from '../../../hooks/useCountryStats.js'
import WineCard from '../wineCard/WineCard'
import type { WineSearchResult } from '../../../types/wine.js'
import { fetchWinesByCountry } from '../../../services/api/wineService.js'
import './WorldMap.css'

// Define interfaces for ECharts options
interface MapDataItem {
  name: string
  value: number
  wineCount: number
  avgPrice: number | null
  varieties: Array<{
    name: string
    count: number
    percentage: number
  }>
}

interface TooltipParams {
  name: string
  data: MapDataItem
}

interface WorldMapProps {
  selectedCountry: string | null
  onCountrySelect: (country: string) => void
}

interface EChartsOption {
  backgroundColor: string
  title?: {
    text: string
    left: string
    textStyle: {
      color: string
    }
  }
  tooltip: {
    trigger: string
    formatter: (params: TooltipParams) => string | HTMLElement
  }
  visualMap: {
    left: string
    min: number
    max: number
    text: string[]
    calculable: boolean
    inRange: {
      color: string[]
    }
  }
  series: Array<{
    name: string
    type: string
    map: string
    roam: boolean
    emphasis: {
      label: {
        show: boolean
      }
      itemStyle: {
        areaColor: string
      }
    }
    data: MapDataItem[]
    selectedMode?: string
    select?: {
      itemStyle: {
        areaColor: string
      }
    }
  }>
}

interface ClickEventParams {
  data: {
    name: string
  }
}

/**
 * WorldMap component that displays an interactive world map visualization
 * for wine data using Apache ECharts.
 *
 * @returns {JSX.Element} The WorldMap component
 */
const WorldMap: React.FC<WorldMapProps> = ({ onCountrySelect }) => {
  // Initialize mapOptions as null with proper type
  const [mapOptions, setMapOptions] = useState<EChartsOption | null>(null)
  // Use our custom hook to fetch country stats
  const {
    countryStats,
    loading: statsLoading,
    error: statsError,
  } = useCountryStats()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [countryWines, setCountryWines] = useState<WineSearchResult[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMoreWines, setHasMoreWines] = useState<boolean>(false)
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(
    null
  )

  // Load the GeoJSON data on component mount and register the map
  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/data/countries.geo.json')

        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status}`)
        }

        const geoJson = await response.json()

        // Register the map with echarts
        echarts.registerMap('world', geoJson)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching GeoJSON:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchGeoJSON()

    // Cleanup function for when component unmounts
    return () => {
      // Instead of unregistering, we can just leave it empty
      // The registry will be cleared when the page is unloaded
    }
  }, [])

  // Update chart options when country stats are loaded
  useEffect(() => {
    if (!loading && !statsLoading && countryStats.length > 0) {
      // Prepare data for the map with proper typing
      const mapData: MapDataItem[] = countryStats.map((country) => ({
        name: country.country,
        value: country.avg_points,
        wineCount: country.count,
        avgPrice: country.avg_price,
        varieties: country.top_varieties,
        originalName: country.original_country,
      }))

      // Create map options
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

            // Create HTML for tooltip with country info and pie chart
            let html = `
              <div style="font-weight:bold;margin-bottom:5px">${params.name}</div>`

            // Check if data.value exists before using toFixed
            if (data.value !== undefined && data.value !== null) {
              html += `<div>Average Rating: ${data.value.toFixed(1)}</div>`
            } else {
              html += `<div>Average Rating: No data</div>`
            }

            // Check if wineCount exists
            if (data.wineCount !== undefined) {
              html += `<div>Wine Count: ${data.wineCount}</div>`
            }

            // Check if avgPrice exists before using toFixed
            if (data.avgPrice) {
              html += `<div>Average Price: $${data.avgPrice.toFixed(2)}</div>`
            }

            // Add varieties information if available
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
          min: 80, // Wines are usually rated from 80-100
          max: 95,
          text: ['High Rating', 'Low Rating'],
          calculable: true,
          inRange: {
            color: ['#f2da87', '#cc4025'], // Yellow to red color range for wine ratings
          },
        },
        series: [
          {
            name: 'Wine Ratings',
            type: 'map',
            map: 'world',
            roam: true, // Enable zooming and panning
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
  }, [loading, statsLoading, countryStats])

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

  if (loading || statsLoading)
    return <div className="loading">Loading map and data...</div>
  if (error) return <div className="error">Error loading map: {error}</div>
  if (statsError)
    return <div className="error">Error loading data: {statsError}</div>
  if (!mapOptions) return <div className="error">No map data available</div>

  return (
    <div className="world-map-container">
      <h2>Wine Producing Countries</h2>
      <p style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        Choose a country to see more information
      </p>
      <p style={{ textAlign: 'center', color: '#888', fontSize: '0.95rem' }}>
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
    </div>
  )
}

export default WorldMap
