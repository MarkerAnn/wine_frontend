// components/WorldMap.tsx
import React, { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { useCountryStats } from '../../../hooks/useCountryStats.js'
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
const WorldMap: React.FC<WorldMapProps> = ({
  selectedCountry,
  onCountrySelect,
}) => {
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

  // Update selected country when it changes
  useEffect(() => {
    if (mapOptions && selectedCountry) {
      const newOptions = { ...mapOptions }
      newOptions.series[0].selectedMode = 'single'
      newOptions.series[0].select = {
        itemStyle: {
          areaColor: '#7b68ee',
        },
      }
      setMapOptions(newOptions)
    }
  }, [selectedCountry, mapOptions])

  // Handle map click events
  const onEvents = {
    click: (params: ClickEventParams) => {
      if (params.data) {
        onCountrySelect(params.data.name)
      }
    },
  }

  if (loading || statsLoading)
    return <div className="loading">Laddar karta och vindata...</div>
  if (error)
    return <div className="error">Fel vid laddning av karta: {error}</div>
  if (statsError)
    return (
      <div className="error">Fel vid laddning av vindata: {statsError}</div>
    )
  if (!mapOptions)
    return <div className="error">Ingen kartdata tillgänglig</div>

  return (
    <div className="world-map-container">
      <h2>Vinproducerande Länder</h2>
      {mapOptions && (
        <ReactECharts
          option={mapOptions}
          style={{ height: '600px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          onEvents={onEvents}
        />
      )}
    </div>
  )
}

export default WorldMap
