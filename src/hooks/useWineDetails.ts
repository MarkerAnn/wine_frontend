import { useState } from 'react'
import { fetchWineById } from '../services/api/wineService.js'
import type { Wine } from '../types/wine.js'

/**
 * Custom hook for handling wine details and modal state
 */
export function useWineDetails() {
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null)
  const [isLoadingWine, setIsLoadingWine] = useState<boolean>(false)

  const handleOpenWine = async (id: number) => {
    try {
      setIsLoadingWine(true)
      const wine = await fetchWineById(id)
      setSelectedWine(wine)
    } catch (err) {
      console.error('Failed to fetch wine:', err)
    } finally {
      setIsLoadingWine(false)
    }
  }

  const handleCloseWine = () => setSelectedWine(null)

  return {
    selectedWine,
    isLoadingWine,
    handleOpenWine,
    handleCloseWine,
  }
}
