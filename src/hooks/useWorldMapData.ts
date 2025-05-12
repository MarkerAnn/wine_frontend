import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as echarts from 'echarts'
import { fetchCountryStats } from '../services/api/wineService.js'
import type { CountryStatsResponse, CountryStats } from '../types/wine.js'
import type {
  MapDataItem,
  EChartsOption,
  TooltipParams,
} from '../types/worldMap.js'

/**
 * Creates ECharts options for the world map visualization
 */
const createMapOptions = (mapData: MapDataItem[]): EChartsOption => ({
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
    formatter: (params: TooltipParams): string => {
      const data = params.data
      if (!data) return params.name

      let html = `<div style="font-weight:bold;margin-bottom:5px">${params.name}</div>`

      if (data.value !== undefined && data.value !== null) {
        html += `<div>Average Rating: ${data.value.toFixed(1)}</div>`
      }

      if (data.wineCount !== undefined) {
        html += `<div>Wine Count: ${data.wineCount}</div>`
      }

      if (data.avgPrice) {
        html += `<div>Average Price: $${data.avgPrice.toFixed(2)}</div>`
      }

      if (data.varieties && data.varieties.length > 0) {
        html += `<div style="margin-top:10px"><b>Top Varieties:</b></div>`
        data.varieties.forEach((v) => {
          html += `<div>${v.name}: ${v.percentage}%</div>`
        })
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
})

/**
 * Custom hook for managing world map data and visualization
 * Handles loading GeoJSON and country statistics
 */
export function useWorldMapData() {
  const [mapOptions, setMapOptions] = useState<EChartsOption | null>(null)
  const [geoJsonLoading, setGeoJsonLoading] = useState(true)
  const [geoJsonError, setGeoJsonError] = useState<string | null>(null)

  // Fetch country statistics
  const {
    data: countryStatsResponse,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<CountryStatsResponse>({
    queryKey: ['countryStats'],
    queryFn: async () => {
      const response = await fetchCountryStats()
      if (!response || !response.items) {
        throw new Error('Invalid response format')
      }
      return response
    },
  })

  // Load GeoJSON data
  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          import.meta.env.BASE_URL + 'data/countries.geo.json'
        )
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status}`)
        }

        const geoJson = await response.json()
        echarts.registerMap('world', geoJson)
        setGeoJsonLoading(false)
      } catch (err) {
        setGeoJsonError(err instanceof Error ? err.message : 'Unknown error')
        setGeoJsonLoading(false)
      }
    }

    fetchGeoJSON()
  }, [])

  // Create map options when data is loaded
  useEffect(() => {
    const countryStats = countryStatsResponse?.items || []

    if (!geoJsonLoading && !statsLoading && countryStats.length > 0) {
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

      setMapOptions(createMapOptions(mapData))
    }
  }, [geoJsonLoading, statsLoading, countryStatsResponse])

  return {
    mapOptions,
    isLoading: geoJsonLoading || statsLoading,
    error: geoJsonError || statsError,
    countryStats: countryStatsResponse?.items || [],
  }
}
