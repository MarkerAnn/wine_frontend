import { useWineSearch } from '../../../hooks/useWineSearch.js'
import { useWineFilters } from '../../../hooks/useWineFilters.js'
import { useWineDetails } from '../../../hooks/useWineDetails.js'
import { SearchForm } from './SearchForm.js'
import { SearchResults } from './SearchResults.js'
import { Pagination } from '../common/Pagination.js'
import WineModal from '../wineCard/WineModal.js'
import './SearchWines.css'

/**
 * Main search component that orchestrates wine searching functionality
 * Combines search form, results display, and wine details viewing
 */
export const SearchWines: React.FC = () => {
  // Custom hooks for different functionalities
  const {
    formData,
    setFormData,
    searchResult,
    isLoading: isSearchLoading,
    error: searchError,
    searchHasBeenMade,
    handleSearch,
  } = useWineSearch()

  const {
    countries,
    varieties,
    isLoading: isFiltersLoading,
    errors: filterErrors,
  } = useWineFilters()

  const { selectedWine, isLoadingWine, handleOpenWine, handleCloseWine } =
    useWineDetails()

  // Handle form input changes
  const handleFormChange = (
    name: string,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page on filter change
    }))
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFormData((prev) => ({
      ...prev,
      page: newPage,
    }))
    handleSearch()
  }

  return (
    <div className="search-wines-container">
      <h2 className="search-title">Search Wines</h2>

      {/* Display any filter loading errors */}
      {(filterErrors.countries || filterErrors.varieties) && (
        <div className="filter-errors">
          {filterErrors.countries && (
            <p>Failed to load countries. Some filters may be unavailable.</p>
          )}
          {filterErrors.varieties && (
            <p>Failed to load varieties. Some filters may be unavailable.</p>
          )}
        </div>
      )}

      {/* Search form */}
      <SearchForm
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSearch}
        isLoading={isSearchLoading}
        countries={countries}
        varieties={varieties}
        isFiltersLoading={isFiltersLoading}
      />

      {/* Search results */}
      <SearchResults
        items={searchResult?.items ?? []}
        isLoading={isSearchLoading}
        error={searchError}
        searchHasBeenMade={searchHasBeenMade}
        onWineSelect={handleOpenWine}
        totalCount={searchResult?.total}
      />

      {/* Pagination */}
      {searchResult && (
        <Pagination
          currentPage={formData.page}
          totalPages={searchResult.pages}
          onPageChange={handlePageChange}
          isLoading={isSearchLoading}
        />
      )}

      {/* Wine details modal */}
      {selectedWine && (
        <WineModal wine={selectedWine} onClose={handleCloseWine} />
      )}

      {/* Loading overlay for wine details */}
      {isLoadingWine && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  )
}
