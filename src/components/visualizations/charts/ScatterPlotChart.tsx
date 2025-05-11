import ReactECharts from 'echarts-for-react'
import type { WineBucket } from '../../../types/wine'
import './ScatterPlotChart.css'

interface ScatterPlotChartProps {
  data: WineBucket[]
  onPointClick: (price: number, points: number) => void
  className?: string
}

interface ChartDataPoint {
  value: [number, number]
  title: string
  price: number
  points: number
  count: number
}

interface TooltipParams {
  data: ChartDataPoint
}

/**
 * Renders a scatter plot of wine prices vs ratings using ECharts
 * Handles zoom interactions and point clicking
 */
export const ScatterPlotChart = ({
  data,
  onPointClick,
  className = '',
}: ScatterPlotChartProps) => {
  const transformBucketToDataPoint = (bucket: WineBucket): ChartDataPoint => {
    const avgPrice = (bucket.price_min + bucket.price_max) / 2
    const avgPoints = (bucket.points_min + bucket.points_max) / 2

    return {
      value: [avgPrice, avgPoints],
      title: `Bucket $${bucket.price_min}-${bucket.price_max}, ${bucket.points_min}-${bucket.points_max} points`,
      price: avgPrice,
      points: avgPoints,
      count: bucket.count,
    }
  }

  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: (params: TooltipParams) => `
        <strong>${params.data.title}</strong><br/>
        Price: $${params.data.price.toFixed(2)}<br/>
        Points: ${params.data.points.toFixed(1)}<br/>
        Count: ${params.data.count} wines
      `,
    },
    grid: {
      left: '10%',
      right: '5%',
      top: '10%',
      bottom: '15%',
    },
    xAxis: {
      name: 'Price (USD)',
      nameLocation: 'middle',
      nameGap: 30,
      type: 'value',
      min: 0,
      max: 500,
      axisLabel: {
        formatter: (value: number) => `$${value}`,
      },
    },
    yAxis: {
      name: 'Points',
      nameLocation: 'middle',
      nameGap: 30,
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
        itemStyle: {
          opacity: 0.3,
          color: '#6366f1', // Indigo color for points
        },
        emphasis: {
          itemStyle: {
            opacity: 0.8,
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
          },
        },
        data: data.map(transformBucketToDataPoint),
      },
    ],
  }

  const handleChartClick = (params: TooltipParams) => {
    onPointClick(params.data.price, params.data.points)
  }

  return (
    <div className={`scatter-plot-chart ${className}`.trim()}>
      <ReactECharts
        option={chartOptions}
        style={{ height: '600px', width: '100%' }}
        onEvents={{
          click: handleChartClick,
        }}
      />
    </div>
  )
}
