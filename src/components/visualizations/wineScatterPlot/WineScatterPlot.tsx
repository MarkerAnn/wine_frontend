import React, { useState } from 'react'
import ReactECharts from 'echarts-for-react'
import {
  fetchWineScatterData,
  fetchBucketWines,
} from '../../../services/api/wineService'
import { WineInBucket } from '../../../types/wine'
import WineCard from '../wineCard/WineCard'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { WineBucket } from '../../../types/wine'
import './WineScatterPlot.css'

/**
 * WineScatterPlot component displays a scatterplot of wine price vs rating.
 * It uses React Query's useInfiniteQuery to handle paginated data fetching
 * and caching automatically.
 *
 * When a point is clicked, it loads the wines from that bucket.
 *
 * @returns {JSX.Element} The WineScatterPlot component
 */
const WineScatterPlot: React.FC = () => {
  // State for wines in the selected bucket
  const [bucketWines, setBucketWines] = useState<WineInBucket[]>([])
  const [priceMin, setPriceMin] = useState<number | null>(null)
  const [priceMax, setPriceMax] = useState<number | null>(null)
  const [pointsMin, setPointsMin] = useState<number | null>(null)
  const [pointsMax, setPointsMax] = useState<number | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMoreWines, setHasMoreWines] = useState<boolean>(false)

  // React Query: infinite query to fetch scatterplot data
  const {
    data: scatterData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<WineBucket[]>({
    queryKey: ['scatterBuckets'],
    queryFn: ({ pageParam }) => fetchWineScatterData(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage: WineBucket[], allPages: WineBucket[][]) => {
      // If lastPage is empty, stop fetching more
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
    refetchInterval: 5000, // automatically refresh every 5 seconds
  })

  /**
   * Handle clicking a point in the scatterplot
   * Fetch wines in the selected bucket and update state
   */
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
    } catch (err) {
      console.error('Failed to fetch wines for selected bucket', err)
    }
  }

  /**
   * Load more wines within the same bucket when user clicks "Next Page"
   */
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
    } catch (err) {
      console.error('Failed to load more wines', err)
    }
  }

  // Prepare chart options for ECharts
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
      max: 500, // Initial range
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
        end: (500 / 3500) * 100,
      },
      {
        type: 'slider', // visible slider at the bottom
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
        data:
          scatterData?.pages.flat().map((bucket: WineBucket) => ({
            value: [
              (bucket.price_min + bucket.price_max) / 2,
              (bucket.points_min + bucket.points_max) / 2,
            ],
            title: `Bucket ${bucket.price_min}-${bucket.price_max} USD, ${bucket.points_min}-${bucket.points_max} points`,
            price: (bucket.price_min + bucket.price_max) / 2,
            points: (bucket.points_min + bucket.points_max) / 2,
            count: bucket.count,
          })) ?? [],
      },
    ],
  }

  // Handle loading/error states for the scatterplot
  if (isLoading) return <div>Loading scatterplot...</div>
  if (error) return <div>Error: {String(error)}</div>

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Wine Price vs Rating</h2>
      <ReactECharts
        option={chartOptions}
        style={{ height: '600px', width: '100%' }}
        onEvents={{ click: handlePointClick }}
      />

      {/* Bucket loading status */}
      <div className="loading-status mt-4">
        {hasNextPage ? (
          isFetchingNextPage ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div className="spinner" />
              <span>Loading more buckets...</span>
            </div>
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="load-more-button"
            >
              Load More Buckets
            </button>
          )
        ) : (
          <span>All buckets loaded.</span>
        )}
      </div>

      {/* Wines in the selected bucket */}
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
            <div className="load-more-container mt-4">
              <button
                onClick={loadMoreWines}
                type="button"
                className="load-more-button"
              >
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
