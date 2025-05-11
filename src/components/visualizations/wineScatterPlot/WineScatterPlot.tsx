import { useScatterData } from '../../../hooks/useScatterData.js'
import { useBucketData } from '../../../hooks/useBucketData.js'
import { useWineDetails } from '../../../hooks/useWineDetails.js'
import { ScatterPlotChart } from '../charts/ScatterPlotChart.js'
import { BucketWinesList } from '../BucketWinesList.js'
import WineModal from '../wineCard/WineModal.js'
import './WineScatterPlot.css'

/**
 * Main component that orchestrates the wine visualization experience
 * Combines scatter plot, bucket list, and wine details functionality
 */
export const WineScatterPlot: React.FC = () => {
  // Custom hooks handle specific functionality
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

  // Handle loading and error states
  if (isLoadingScatter)
    return <div className="loading">Loading scatter plot...</div>
  if (scatterError)
    return <div className="error">Error: {String(scatterError)}</div>

  return (
    <div className="wine-scatter-container">
      <h2 className="main-title">Wine Price vs Rating Analysis</h2>

      {/* Scatter Plot Section */}
      <section className="scatter-plot-section">
        <ScatterPlotChart data={scatterData} onPointClick={loadBucketWines} />

        {/* Scatter Plot Pagination */}
        <div className="pagination-controls">
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="load-more-button"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More Data Points'}
            </button>
          )}
        </div>
      </section>

      {/* Bucket Wines Section */}
      <section className="bucket-wines-section">
        <BucketWinesList
          wines={bucketWines}
          hasMore={hasMoreWines}
          isLoading={isLoadingWine}
          onLoadMore={loadMoreWines}
          onWineSelect={handleOpenWine}
          bucketRange={bucketRange}
        />
      </section>

      {/* Wine Details Modal */}
      {selectedWine && (
        <WineModal wine={selectedWine} onClose={handleCloseWine} />
      )}
    </div>
  )
}
