// Interface for map data used by ECharts
export interface MapDataItem {
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

// Tooltip params structure for ECharts
export interface TooltipParams {
  name: string
  data: MapDataItem
}

// Props expected by the WorldMap component
export interface WorldMapProps {
  onCountrySelect: (countryName: string) => void
  selectedCountry: string | null
  className?: string
}

// Interface for ECharts map options
export interface EChartsOption {
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

// Params for click event from ECharts
export interface ClickEventParams {
  data: {
    name: string
  }
}
