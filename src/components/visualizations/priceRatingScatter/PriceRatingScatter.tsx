import React, { useMemo, useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import type { ECElementEvent } from 'echarts'
import { BucketInfo } from '../../../hooks/useHeatmapData'
import { BucketWineList } from '../../BucketWineList'
import './PriceRatingScatter.css'

interface PriceRatingScatterProps {
  data: {
    data: number[][]
    x_categories: number[]
    y_categories: number[]
    bucket_map: { [key: string]: BucketInfo }
    max_count: number
    total_wines: number
    bucket_size: {
      price: number
      points: number
    }
  } | null
  loading: boolean
  onPointClick?: (bucket: BucketInfo) => void
}

/**
 * Heatmap component for visualizing wine price vs rating data
 * Optimized to work with server-processed data formats
 */
const PriceRatingScatter: React.FC<PriceRatingScatterProps> = ({
  data,
  loading,
  onPointClick,
}) => {
  // State för att hålla koll på vald bucket
  const [selectedBucket, setSelectedBucket] = useState<BucketInfo | null>(null)

  // Prepare chart options using the pre-formatted data
  const options = useMemo(() => {
    if (
      !data?.data?.length ||
      !data.x_categories?.length ||
      !data.y_categories?.length
    ) {
      return {}
    }

    return {
      title: {
        text: 'Vinpris vs. Betygsfördelning',
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params: ECElementEvent) {
          if (!params.data || !Array.isArray(params.data)) return ''

          const [xIndex, yIndex, count] = params.data as [
            number,
            number,
            number,
          ]

          // Get the original values from categories
          const priceMin = data.x_categories[xIndex]
          const pointsMin = data.y_categories[yIndex]

          // Look up the original bucket
          const key = `${priceMin}-${pointsMin}`
          const bucket = data.bucket_map[key]

          if (!bucket) {
            return `Pris: $${priceMin}<br/>Betyg: ${pointsMin}<br/>Antal viner: ${count}`
          }

          let html = `
            <div style="font-weight:bold;margin-bottom:5px">
              Pris: $${bucket.price_min.toFixed(0)} - $${bucket.price_max.toFixed(0)}<br/>
              Betyg: ${bucket.points_min} - ${bucket.points_max} poäng
            </div>
            <div>Antal viner: <b>${bucket.count}</b></div>
          `

          if (bucket.examples && bucket.examples.length > 0) {
            html +=
              '<div style="margin-top:8px;border-top:1px solid #eee;padding-top:8px;"><b>Exempelviner:</b></div>'
            bucket.examples.forEach((example) => {
              html += `
                <div style="margin-top:5px;padding-top:3px;">
                  <b>${example.name || 'Okänt vin'}</b><br/>
                  ${example.winery || 'Okänt vineri'}<br/>
                  $${example.price.toFixed(2)} | ${example.points} poäng
                </div>
              `
            })
          }

          return html
        },
      },
      grid: {
        left: '5%',
        right: '8%',
        bottom: '25%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.x_categories,
        name: 'Pris (USD)',
        nameLocation: 'middle',
        nameGap: 35,
        axisLabel: {
          formatter: (value: number) => `$${value}`,
          rotate: 45,
        },
      },
      yAxis: {
        type: 'category',
        data: data.y_categories,
        name: 'Betyg (poäng)',
        nameLocation: 'middle',
        nameGap: 45,
      },
      visualMap: {
        min: 0,
        max: data.max_count,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '12%',
        itemWidth: 15,
        itemHeight: 100,
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026',
          ],
        },
        text: ['Hög densitet', 'Låg densitet'],
        textStyle: {
          fontSize: 12,
        },
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
        {
          type: 'slider',
          xAxisIndex: 0,
          bottom: '5%',
          height: 20,
          start: 0,
          end: 40,
          borderColor: '#ccc',
          textStyle: {
            color: '#666',
            fontSize: 11,
          },
          handleStyle: {
            color: '#666',
          },
          moveHandleStyle: {
            color: '#666',
          },
          emphasis: {
            handleStyle: {
              borderColor: '#999',
            },
          },
          labelFormatter: (value: number) => {
            const price = data.x_categories[value]?.toFixed(0) || value
            return `$${price}`
          },
          showDetail: true,
          right: '8%',
          left: '8%',
          textGap: 10,
        },
      ],
      series: [
        {
          name: 'Vinfördelning',
          type: 'heatmap',
          data: data.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: false,
          },
          itemStyle: {
            opacity: 0.8,
          },
          silent: false,
        },
      ],
    }
  }, [data])

  // Handle click events
  const onChartClick = (params: ECElementEvent) => {
    console.log('Click event:', params)

    if (!data?.data?.length || !params.data || !Array.isArray(params.data)) {
      console.log('Early return due to invalid data:', {
        hasData: !!data?.data?.length,
        hasParamsData: !!params.data,
        isArray: Array.isArray(params.data),
      })
      return
    }

    const [xIndex, yIndex] = params.data as [number, number, number]
    console.log('Indices:', { xIndex, yIndex })

    // Get the original values from categories
    const priceMin = data.x_categories[xIndex]
    const pointsMin = data.y_categories[yIndex]
    console.log('Values:', { priceMin, pointsMin })

    // Look up the original bucket only if we have valid indices
    if (typeof priceMin === 'number' && typeof pointsMin === 'number') {
      // Matcha exakt format från backend: "X.0-Y"
      const key = `${priceMin.toFixed(1)}-${pointsMin}`
      console.log('Looking for key:', key)

      const bucket = data.bucket_map[key]

      if (bucket) {
        console.log('Found bucket:', bucket)
        setSelectedBucket(bucket)
        if (onPointClick) {
          onPointClick(bucket)
        }
      } else {
        console.log('No bucket found for key:', key)
        console.log(
          'Available keys near this value:',
          Object.keys(data.bucket_map)
            .filter((k) => k.includes(`${Math.floor(priceMin)}`))
            .slice(0, 5)
        )
      }
    }
  }

  // Lägg till useEffect för att övervaka selectedBucket
  useEffect(() => {
    console.log('selectedBucket changed:', selectedBucket)
  }, [selectedBucket])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-50 text-gray-500 italic">
        Laddar vindata...
      </div>
    )
  }

  if (!data?.data?.length) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-50 text-gray-500 italic">
        Ingen data tillgänglig. Försök ändra filter.
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
        notMerge={true}
      />
      <div className="mt-2 text-center text-sm text-gray-500">
        Totalt antal viner: {data.total_wines}
      </div>

      {/* Visa BucketWineList när en bucket är vald */}
      {selectedBucket && (
        <BucketWineList
          bucket={selectedBucket}
          onClose={() => setSelectedBucket(null)}
        />
      )}
    </div>
  )
}

export default PriceRatingScatter

// TODO: Uk - different names in file and map
