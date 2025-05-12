import { useRagSearch } from '../../../hooks/useRagSearch.js'
import { useWineDetails } from '../../../hooks/useWineDetails.js'
import { RagSearchForm } from './RagSearchForm.js'
import { WineList } from '../wineList/WineList.js'
import { LoadingSpinner } from '../common/loadingSpinner/LoadingSpinner.js'
import WineModal from '../wineCard/WineModal.js'
import type { RagSource } from '../../../types/wine.js'
import './SearchWithRag.css'

/**
 * SearchWithRag component provides a natural language interface
 * to search wine information using RAG
 */
export const SearchWithRag = () => {
  const {
    query,
    setQuery,
    querySubmitted,
    result,
    isPending,
    isError,
    error,
    handleSubmit,
  } = useRagSearch()

  const { selectedWine, isLoadingWine, handleOpenWine, handleCloseWine } =
    useWineDetails()

  const adaptSourceToWineSearchResult = (source: RagSource) => ({
    id: typeof source.id === 'string' ? parseInt(source.id, 10) : source.id,
    title: source.title,
    country: source.country,
    variety: source.variety,
    price: undefined,
    points: undefined,
    winery: undefined,
  })

  return (
    <div className="rag-search-container">
      <RagSearchForm
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />

      {isError && (
        <div className="error-message">
          {(error as Error)?.message ?? 'Something went wrong.'}
        </div>
      )}

      {querySubmitted && !isPending && !result?.answer && (
        <p className="no-results-message">No answer found.</p>
      )}

      {result?.answer && (
        <div className="results-container">
          <div className="answer-box">{result.answer}</div>

          {result.sources?.length > 0 && (
            <WineList
              wines={result.sources.map(adaptSourceToWineSearchResult)}
              title="Recommended Wines"
              hasMore={false}
              isLoading={isLoadingWine}
              onLoadMore={() => {}}
              onWineSelect={handleOpenWine}
            />
          )}
        </div>
      )}

      {selectedWine && (
        <WineModal wine={selectedWine} onClose={handleCloseWine} />
      )}

      {isLoadingWine && (
        <div className="loading-overlay">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}

export default SearchWithRag
