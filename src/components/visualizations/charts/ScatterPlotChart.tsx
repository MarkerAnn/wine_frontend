import ReactECharts from 'echarts-for-react'
import type { WineBucket } from '../../../types/wine.js'

interface ScatterPlotChartProps {
  data: WineBucket[]
  onPointClick: (price: number, points: number) => void
}

/**
 * Renders a scatter plot of wine prices vs ratings using ECharts
 * Handles zoom interactions and point clicking
 */
export const ScatterPlotChart: React.FC<ScatterPlotChartProps> = ({
  data,
  onPointClick,
}) => {
  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `
        <strong>${params.data.title}</strong><br/>
        Price: $${params.data.price}<br/>
        Points: ${params.data.points}<br/>
        Count: ${params.data.count}
      `,
    },
    xAxis: {
      name: 'Price (USD)',
      type: 'value',
      min: 0,
      max: 500,
    },
    yAxis: {
      name: 'Points',
      type: 'value',
      min: 80,
      max: 100,
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: (500 / 3500) * 100,
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        start: 0,
        end: (500 / 3500) * 100,
      },
    ],
    series: [
      {
        type: 'scatter',
        symbolSize: 8,
        itemStyle: { opacity: 0.3 },
        data: data.map((bucket) => ({
          value: [
            (bucket.price_min + bucket.price_max) / 2,
            (bucket.points_min + bucket.points_max) / 2,
          ],
          title: `Bucket ${bucket.price_min}-${bucket.price_max} USD, ${bucket.points_min}-${bucket.points_max} points`,
          price: (bucket.price_min + bucket.price_max) / 2,
          points: (bucket.points_min + bucket.points_max) / 2,
          count: bucket.count,
        })),
      },
    ],
  }

  return (
    <ReactECharts
      option={chartOptions}
      style={{ height: '600px', width: '100%' }}
      onEvents={{
        click: (params: any) => {
          onPointClick(params.data.price, params.data.points)
        },
      }}
    />
  )
}
