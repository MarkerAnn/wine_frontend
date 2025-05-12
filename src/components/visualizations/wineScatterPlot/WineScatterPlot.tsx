import { useScatterData } from '../../../hooks/useScatterData.js'
import { useBucketData } from '../../../hooks/useBucketData.js'
import { useWineDetails } from '../../../hooks/useWineDetails.js'
import { ScatterPlotChart } from '../charts/ScatterPlotChart.js'
import { WineList } from '../wineList/WineList.js'
import { LoadMoreButton } from '../common/loadMoreButton/LoadMoreButton.js'
import { LoadingSpinner } from '../common/loadingSpinner/LoadingSpinner.js'
import WineModal from '../wineCard/WineModal.js'
import './WineScatterPlot.css'

interface WineScatterPlotProps {
  className?: string
}

/**
 * Visualizes wine data in a scatter plot showing price vs rating
 * Allows exploration of wine data through interactive points and buckets
 */
export const WineScatterPlot = ({ className = '' }: WineScatterPlotProps) => {
  const {
    scatterData,
    isLoading: isLoadingScatter,
    error: scatterError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useScatterData()

  const {
    bucketWines,
    hasMoreWines,
    bucketRange,
    loadBucketWines,
    loadMore: loadMoreWines,
  } = useBucketData()

  const { selectedWine, isLoadingWine, handleOpenWine, handleCloseWine } =
    useWineDetails()

  if (isLoadingScatter) {
    return <LoadingSpinner message="Loading scatter plot..." />
  }

  if (scatterError) {
    return (
      <div className="error-message">
        Error:{' '}
        {scatterError instanceof Error ? scatterError.message : 'Unknown error'}
      </div>
    )
  }

  // Format bucket range for title
  const getBucketTitle = () => {
    if (
      !bucketRange ||
      bucketRange.priceMin === null ||
      bucketRange.priceMax === null ||
      bucketRange.pointsMin === null ||
      bucketRange.pointsMax === null
    ) {
      return undefined
    }

    return (
      `Wines $${bucketRange.priceMin}-${bucketRange.priceMax}, ` +
      `${bucketRange.pointsMin}-${bucketRange.pointsMax} points`
    )
  }

  return (
    <div className={`wine-scatter-plot ${className}`.trim()}>
      <h2 className="visualization-title">Wine Price vs Rating Analysis</h2>

      <section className="scatter-plot-section">
        <ScatterPlotChart data={scatterData} onPointClick={loadBucketWines} />

        {hasNextPage && (
          <div className="load-more-container">
            <LoadMoreButton
              onClick={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
              text="Load More Data Points"
              loadingText="Loading Data Points..."
            />
          </div>
        )}
      </section>

      <section className="bucket-section">
        <WineList
          wines={bucketWines}
          title={getBucketTitle()}
          hasMore={hasMoreWines}
          isLoading={isLoadingWine}
          onLoadMore={loadMoreWines}
          onWineSelect={handleOpenWine}
        />
      </section>

      {selectedWine && (
        <WineModal wine={selectedWine} onClose={handleCloseWine} />
      )}
    </div>
  )
}

export default WineScatterPlot
