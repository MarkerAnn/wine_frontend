// components/WineScatterPlot.tsx
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import {
  fetchWineScatterData,
  fetchBucketWines,
} from '../../../services/api/wineService'
import { WineInBucket, PriceRatingBucket } from '../../../types/wine'
import WineCard from '../wineCard/WineCard'
import './WineScatterPlot.css'

const WineScatterPlot: React.FC = () => {
  const [data, setData] = useState<PriceRatingBucket[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [hasMoreData, setHasMoreData] = useState<boolean>(true)

  const [bucketWines, setBucketWines] = useState<WineInBucket[]>([])
  const [priceMin, setPriceMin] = useState<number | null>(null)
  const [priceMax, setPriceMax] = useState<number | null>(null)
  const [pointsMin, setPointsMin] = useState<number | null>(null)
  const [pointsMax, setPointsMax] = useState<number | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMoreWines, setHasMoreWines] = useState<boolean>(false)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const result = await fetchWineScatterData(page)
        if (result.length > 0) {
          setData(result)
          setPage((prev) => prev + 1)
          console.log(`Initial load: ${result.length} wines.`)
        } else {
          setHasMoreData(false)
        }
      } catch {
        setError('Failed to load wine scatter data')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  useEffect(() => {
    const fetchMoreData = async () => {
      if (!hasMoreData || loading) return

      try {
        const result = await fetchWineScatterData(page)
        if (result.length > 0) {
          setData((prevData) => [...prevData, ...result])
          console.log(`Page ${page}: Loaded ${result.length} buckets.`)
          setPage((prev) => prev + 1)
        } else {
          console.log('No more wines to load. Finished loading.')
          setHasMoreData(false)
        }
      } catch (error) {
        console.error('Failed to load more scatter data', error)
      }
    }

    const interval = setInterval(fetchMoreData, 5000) // every 5 seconds
    return () => clearInterval(interval)
  }, [page, hasMoreData, loading])

  const handlePointClick = async (params: {
    data: { price: number; points: number }
  }) => {
    const clickedPrice = params.data.price
    const clickedPoints = params.data.points

    const priceRange = 10
    const pointsRange = 1

    const minPrice = Math.floor(clickedPrice / priceRange) * priceRange
    const maxPrice = minPrice + priceRange
    const minPoints = Math.floor(clickedPoints / pointsRange) * pointsRange
    const maxPoints = minPoints + pointsRange

    setPriceMin(minPrice)
    setPriceMax(maxPrice)
    setPointsMin(minPoints)
    setPointsMax(maxPoints)
    setCursor(null)

    try {
      const fetched = await fetchBucketWines(
        minPrice,
        maxPrice,
        minPoints,
        maxPoints,
        10
      )
      setBucketWines(fetched.wines)
      setCursor(fetched.pagination.next_cursor || null)
      setHasMoreWines(fetched.pagination.has_next)
    } catch (error) {
      console.error('Failed to fetch wines for selected bucket', error)
    }
  }

  const loadMoreWines = async () => {
    if (
      priceMin === null ||
      priceMax === null ||
      pointsMin === null ||
      pointsMax === null
    )
      return

    try {
      const fetched = await fetchBucketWines(
        priceMin,
        priceMax,
        pointsMin,
        pointsMax,
        10,
        cursor
      )
      setBucketWines((prev) => [...prev, ...fetched.wines])
      setCursor(fetched.pagination.next_cursor || null)
      setHasMoreWines(fetched.pagination.has_next)
    } catch (error) {
      console.error('Failed to load more wines', error)
    }
  }

  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: (params: {
        data: { title: string; price: number; points: number; count: number }
      }) => `
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
      max: 500, // Show initial range
    },
    yAxis: {
      name: 'Points',
      type: 'value',
      min: 80,
      max: 100,
    },
    dataZoom: [
      {
        type: 'inside', // allows scrolling with mouse/touch
        xAxisIndex: 0,
        start: 0,
        end: (500 / 3500) * 100, // initial 0–500 of max price 3500
      },
      {
        type: 'slider', // a visible slider at the bottom
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
        },
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

  if (loading) return <div>Loading scatterplot...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Wine Price vs Rating</h2>
      <ReactECharts
        option={chartOptions}
        style={{ height: '600px', width: '100%' }}
        onEvents={{ click: handlePointClick }}
      />

      {/* Small status marker, no jumping */}
      <div className="loading-status">
        {hasMoreData ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className="spinner" />
            <span>Loading more buckets..</span>
          </div>
        ) : (
          <span>All buckets loaded.</span>
        )}
      </div>

      {bucketWines.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-4 text-xl font-semibold">
            Wines in Selected Bucket
          </h3>
          <div className="flex flex-col gap-4">
            {bucketWines.map((wine) => (
              <WineCard
                key={wine.id}
                wine={{
                  id: wine.id,
                  title: wine.name,
                  country: wine.country,
                  variety: wine.variety,
                  price: wine.price,
                  points: wine.points,
                  winery: wine.winery,
                }}
              />
            ))}
          </div>

          {hasMoreWines && (
            <div className="load-more-container">
              <button onClick={loadMoreWines} className="load-more-button">
                Next Page
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WineScatterPlot
