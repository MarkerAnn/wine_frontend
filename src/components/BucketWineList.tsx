import React, { useEffect, useRef, useState, useCallback } from 'react'
import { BucketInfo } from '../hooks/useHeatmapData'
import useIntersectionObserver from '../hooks/useIntersectionObserver.js'

// Hämta API URL från miljövariabler
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface BucketWineListProps {
  bucket: BucketInfo
  onClose: () => void
}

interface WineDetails {
  id: string
  name: string
  winery: string
  price: number
  points: number
}

interface PaginationState {
  cursor: string | null
  hasMore: boolean
  isLoading: boolean
}

export const BucketWineList: React.FC<BucketWineListProps> = ({
  bucket,
  onClose,
}) => {
  const [wines, setWines] = useState<WineDetails[]>([])
  const [pagination, setPagination] = useState<PaginationState>({
    cursor: null,
    hasMore: true,
    isLoading: false,
  })

  // Ref för infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Använd Intersection Observer för infinite scroll
  const isVisible = useIntersectionObserver(
    loadMoreRef as React.RefObject<Element>
  )

  const loadMoreWines = useCallback(async () => {
    if (pagination.isLoading) return

    setPagination((prev) => ({ ...prev, isLoading: true }))

    try {
      const params = new URLSearchParams({
        price_min: bucket.price_min.toString(),
        price_max: bucket.price_max.toString(),
        points_min: bucket.points_min.toString(),
        points_max: bucket.points_max.toString(),
        limit: '10',
        ...(pagination.cursor && { cursor: pagination.cursor }),
      })

      const response = await fetch(
        `${apiUrl}/api/wines/bucket/?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Received data:', data)

      setWines((prev) => [...prev, ...data.wines])
      setPagination({
        cursor: data.pagination.next_cursor,
        hasMore: data.pagination.has_next,
        isLoading: false,
      })
    } catch (error) {
      console.error('Failed to load wines:', error)
      setPagination((prev) => ({ ...prev, isLoading: false }))
    }
  }, [bucket, pagination.cursor, pagination.isLoading])

  // Ladda mer data när användaren scrollar nära botten
  useEffect(() => {
    if (isVisible && pagination.hasMore && !pagination.isLoading) {
      loadMoreWines()
    }
  }, [isVisible, pagination.hasMore, pagination.isLoading, loadMoreWines])

  // Ladda initial data när komponenten monteras
  useEffect(() => {
    loadMoreWines()
  }, [loadMoreWines])

  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black p-4">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">
            Viner i prisintervall ${bucket.price_min}-${bucket.price_max}, betyg{' '}
            {bucket.points_min}-{bucket.points_max}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {wines.length === 0 && !pagination.isLoading ? (
            <div className="text-center text-gray-500">
              Inga viner hittades i detta intervall.
            </div>
          ) : (
            wines.map((wine) => (
              <div key={wine.id} className="border-b py-3 last:border-0">
                <h3 className="font-semibold">{wine.name}</h3>
                <p className="text-gray-600">{wine.winery}</p>
                <div className="mt-1 text-sm">
                  <span className="text-green-600">${wine.price}</span>
                  <span className="mx-2">•</span>
                  <span className="text-blue-600">{wine.points} poäng</span>
                </div>
              </div>
            ))
          )}

          {pagination.isLoading && (
            <div className="py-4 text-center text-gray-500">
              Laddar fler viner...
            </div>
          )}

          {/* Intersection Observer target */}
          <div ref={loadMoreRef} className="h-10" />
        </div>

        <div className="border-t p-4 text-center text-sm text-gray-500">
          Totalt {bucket.count} viner i detta intervall
        </div>
      </div>
    </div>
  )
}
