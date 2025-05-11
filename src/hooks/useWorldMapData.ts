import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as echarts from 'echarts'
import { fetchCountryStats } from '../services/api/wineService'
import type { CountryStatsResponse, CountryStats } from '../types/wine'
import type { MapDataItem, EChartsOption } from '../types/worldMap'

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
    queryFn: fetchCountryStats,
  })

  // Load GeoJSON data
  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/data/countries.geo.json')
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
