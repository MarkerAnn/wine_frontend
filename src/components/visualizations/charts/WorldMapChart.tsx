import ReactECharts from 'echarts-for-react'
import type {
  TooltipParams,
  EChartsOption,
  ClickEventParams,
} from '../../../types/worldMap.js'
import './WorldMapChart.css'

interface WorldMapChartProps {
  options: EChartsOption
  onCountryClick: (countryName: string) => void
  selectedCountry: string | null
  className?: string
}

/**
 * Renders an interactive world map visualization using ECharts
 * Shows wine statistics per country with tooltips
 */
export const WorldMapChart = ({
  options,
  onCountryClick,
  selectedCountry,
  className = '',
}: WorldMapChartProps) => {
  const createTooltipContent = (params: TooltipParams): string => {
    const data = params.data
    if (!data) return params.name

    let html = `
      <div class="map-tooltip">
        <div class="tooltip-title">${params.name}</div>
    `

    if (data.value !== undefined && data.value !== null) {
      html += `<div class="tooltip-row">Average Rating: ${data.value.toFixed(1)}</div>`
    }

    if (data.wineCount !== undefined) {
      html += `<div class="tooltip-row">Wine Count: ${data.wineCount}</div>`
    }

    if (data.avgPrice) {
      html += `<div class="tooltip-row">Average Price: $${data.avgPrice.toFixed(2)}</div>`
    }

    if (data.varieties && data.varieties.length > 0) {
      html += `
        <div class="tooltip-section">
          <div class="tooltip-subtitle">Top Varieties:</div>
          ${data.varieties
            .map(
              (v) =>
                `<div class="tooltip-variety">${v.name}: ${v.percentage}%</div>`
            )
            .join('')}
        </div>
      `
    }

    html += '</div>'
    return html
  }

  const handleChartClick = (params: ClickEventParams) => {
    if (params.data && params.data.name) {
      onCountryClick(params.data.name)
    }
  }

  const chartOptions: EChartsOption = {
    ...options,
    tooltip: {
      ...options.tooltip,
      formatter: createTooltipContent,
    },
    series: [
      {
        ...options.series[0],
        data: options.series[0].data.map((item) => ({
          ...item,
          selected: item.name === selectedCountry,
        })),
      },
    ],
  }

  return (
    <div className={`world-map-chart ${className}`.trim()}>
      <div className="map-header">
        <h2 className="map-title">Wine Producing Countries</h2>
        <p className="map-description">
          Choose a country to see more information
        </p>
        <p className="map-note">
          To make it to the map, the country must have at least 50 wines
        </p>
      </div>

      <ReactECharts
        option={chartOptions}
        style={{ height: '600px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        onEvents={{
          click: handleChartClick,
        }}
      />
    </div>
  )
}
