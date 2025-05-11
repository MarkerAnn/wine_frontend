import './LoadMoreButton.css'

interface LoadMoreButtonProps {
  onClick: () => void
  isLoading: boolean
  text?: string
  loadingText?: string
  className?: string
}

/**
 * Reusable button component for loading more items
 * Includes loading state and spinner
 */
export const LoadMoreButton = ({
  onClick,
  isLoading,
  text = 'Load More',
  loadingText = 'Loading...',
  className = '',
}: LoadMoreButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`load-more-button ${className}`.trim()}
      aria-label={isLoading ? loadingText : text}
    >
      {isLoading ? (
        <span className="button-content">
          <span className="loading-spinner" aria-hidden="true" />
          {loadingText}
        </span>
      ) : (
        <span className="button-content">{text}</span>
      )}
    </button>
  )
}
