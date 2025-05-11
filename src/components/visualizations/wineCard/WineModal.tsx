import React, { useEffect } from 'react'
import type { Wine } from '../../../types/wine.js'

interface WineModalProps {
  wine: Wine
  onClose: () => void
}

/**
 * WineModal displays detailed wine information in a centered modal.
 */
const WineModal: React.FC<WineModalProps> = ({ wine, onClose }) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="mb-4 ml-auto block text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="mb-2 text-xl font-semibold">{wine.title}</h2>
        <p className="mb-2 text-sm text-gray-600">{wine.description}</p>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>
            <strong>Country:</strong> {wine.country}
          </li>
          <li>
            <strong>Variety:</strong> {wine.variety}
          </li>
          <li>
            <strong>Points:</strong> {wine.points}
          </li>
          {wine.price && (
            <li>
              <strong>Price:</strong> ${wine.price}
            </li>
          )}
          <li>
            <strong>Winery:</strong> {wine.winery}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default WineModal
