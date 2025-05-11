// components/common/Pagination.tsx
import './Pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading: boolean
}

/**
 * Renders a pagination control with previous/next buttons
 * Shows current page and total pages information
 * Disables navigation when loading or at bounds
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}) => {
  if (totalPages <= 1) return null

  const showPreviousButton = currentPage > 1
  const showNextButton = currentPage < totalPages

  return (
    <nav className="pagination" aria-label="Page navigation">
      <div className="pagination-controls">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!showPreviousButton || isLoading}
          className="pagination-button"
          aria-label="Previous page"
        >
          Previous
        </button>

        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!showNextButton || isLoading}
          className="pagination-button"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  )
}
