// components/WineScatterPlot.tsx
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import {
  fetchWineScatterData,
  fetchBucketWines,
} from '../../../services/api/wineService'
import {
  WineScatterPoint,
  BucketWinesResponse,
  WineInBucket,
} from '../../../types/wine'
import './WineScatterPlot.css'

const WineScatterPlot: React.FC = () => {
  const [data, setData] = useState<WineScatterPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false)
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

      setIsFetchingMore(true)
      try {
        const result = await fetchWineScatterData(page)
        if (result.length > 0) {
          setData((prevData) => [...prevData, ...result])
          setPage((prev) => prev + 1)
        } else {
          setHasMoreData(false)
        }
      } catch (error) {
        console.error('Failed to load more scatter data', error)
      } finally {
        setIsFetchingMore(false)
      }
    }

    const interval = setInterval(fetchMoreData, 5000) // var 5:e sekund hämta mer
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
        data: { title: string; price: number; points: number }
      }) => `
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
            <span>Loading more wines...</span>
          </div>
        ) : (
          <span>All wines loaded.</span>
        )}
      </div>

      {bucketWines.length > 0 && (
        <div className="bucket-wines">
          <h3>Wines in Selected Area:</h3>
          <ul>
            {bucketWines.map((wine) => (
              <li key={wine.id}>
                {wine.name} – {wine.price}$ – {wine.points} points –{' '}
                {wine.winery}
              </li>
            ))}
          </ul>
          {hasMoreWines && (
            <button onClick={loadMoreWines} className="load-more-button">
              Load More Wines
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default WineScatterPlot
