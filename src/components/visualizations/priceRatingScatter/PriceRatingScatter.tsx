import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { PriceRatingDataPoint } from '../../../hooks/usePriceRatingData.js'
import type { ECElementEvent } from 'echarts'
import './PriceRatingScatter.css'

interface ScatterDataPoint extends Array<number> {
  0: number // price
  1: number // points
  2: number // id
}

interface PriceRatingScatterProps {
  data: PriceRatingDataPoint[]
  loading: boolean
  onPointClick?: (dataPoint: PriceRatingDataPoint) => void
}

/**
 * Scatterplot component for visualizing wine price vs rating
 */
const PriceRatingScatter: React.FC<PriceRatingScatterProps> = ({
  data,
  loading,
  onPointClick,
}) => {
  const safeData = useMemo(() => data ?? [], [data])

  // Prepare chart options with our data
  const options = useMemo(() => {
    // Create a list of unique countries, uses set to avoid duplicates
    const countries = Array.from(new Set(safeData.map((item) => item.country)))

    const series = countries.map((country) => {
      const countryData = safeData
        .filter((item) => item.country === country)
        .map((item) => [item.price, item.points, item.id]) // [x, y, id]

      return {
        name: country,
        type: 'scatter',
        data: countryData,
        symbolSize: 8,
        itemStyle: {
          opacity: 0.6,
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            opacity: 1,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }
    })

    return {
      title: {
        text: 'Wine Price vs. Rating',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params: ECElementEvent) {
          if (!params.data || !Array.isArray(params.data)) return ''
          const data = params.data as ScatterDataPoint
          const dataPoint = safeData.find((item) => item.id === data[2])
          if (!dataPoint) return ''

          return `
            <strong>${dataPoint.winery}</strong><br/>
            Country: ${dataPoint.country}<br/>
            Variety: ${dataPoint.variety}<br/>
            Price: $${dataPoint.price}<br/>
            Rating: ${dataPoint.points} points
          `
        },
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        bottom: 0,
        left: 'center',
        padding: [10, 0],
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '15%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: 'Price (USD)',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          formatter: '${value}',
        },
      },
      yAxis: {
        type: 'value',
        name: 'Rating (points)',
        nameLocation: 'middle',
        nameGap: 30,
        min: 80,
        max: 100,
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'filter',
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'filter',
        },
      ],
      series,
    }
  }, [safeData])

  // Handle click events
  const onChartClick = (params: ECElementEvent) => {
    if (!onPointClick || !params.data || !Array.isArray(params.data)) return
    const data = params.data as ScatterDataPoint
    const id = data[2]
    const dataPoint = safeData.find((item) => item.id === id)
    if (dataPoint) {
      onPointClick(dataPoint)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-50 text-gray-500 italic">
        Loading data...
      </div>
    )
  }

  if (safeData.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-50 text-gray-500 italic">
        No data available
      </div>
    )
  }

  return (
    <div className="mb-6 overflow-hidden rounded-lg bg-white p-4 shadow-md">
      <ReactECharts
        option={options}
        style={{ height: '600px', width: '100%' }}
        onEvents={{
          click: onChartClick,
        }}
      />
    </div>
  )
}

export default PriceRatingScatter

// TODO: Uk - different names in file and map
