import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  message?: string
}

export const LoadingSpinner = ({
  message = 'Loading...',
}: LoadingSpinnerProps) => {
  return (
    <div className="loading-status">
      <div className="spinner" />
      {message && <p>{message}</p>}
    </div>
  )
}
