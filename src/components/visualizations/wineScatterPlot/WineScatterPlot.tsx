// components/WineScatterPlot.tsx
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { fetchWineScatterData } from '../../../services/api/wineService.js'
import { WineScatterPoint } from '../../../types/wine.js'

/**
 * WineScatterPlot component
 * Displays a scatterplot of wine price vs rating.
 *
 * @returns {JSX.Element} The WineScatterPlot component
 */
const WineScatterPlot: React.FC = () => {
  const [data, setData] = useState<WineScatterPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchWineScatterData()
        setData(result)
      } catch (err) {
        setError('Failed to load wine scatter data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `
        <strong>${params.data.title}</strong><br/>
        Price: $${params.data.price}<br/>
        Points: ${params.data.points}
      `,
    },
    xAxis: {
      name: 'Price (USD)',
      type: 'value',
    },
    yAxis: {
      name: 'Points',
      type: 'value',
      min: 80,
      max: 100,
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 8,
        itemStyle: {
          opacity: 0.3,
        },
        data: data.map((wine) => ({
          value: [wine.price, wine.points],
          title: wine.title,
          price: wine.price,
          points: wine.points,
        })),
      },
    ],
  }

  if (loading) return <div>Loading scatterplot...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="scatterplot-container">
      <h2>Wine Price vs Rating</h2>
      <ReactECharts
        option={chartOptions}
        style={{ height: '600px', width: '100%' }}
      />
    </div>
  )
}

export default WineScatterPlot
