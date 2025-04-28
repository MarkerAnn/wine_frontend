/**
 * Type definitions for wine data
 */

/**
 * Represents a wine from the database
 */
export interface Wine {
  id: number
  title: string
  description: string
  price: number
  capacity: number | null
  grape: string
  secondary_grape_varieties: string | null
  closure: string | null
  country: string
  unit: number | null
  characteristics: string | null
  per_unit: string | null
  type: string
  abv: number
  region: string | null
  style: string
  vintage: number | null
  appellation: string | null
  currency: string
  created_at: string
  source: string
}

/**
 * Filter options for wine queries
 */
export interface WineFilters {
  country?: string
  type?: string
  style?: string
  grape?: string
  vintage?: number | null
  priceMin?: number
  priceMax?: number
  abvMin?: number
  abvMax?: number
  region?: string
  limit?: number
  offset?: number
  sort?: string
  order?: 'asc' | 'desc'
}

/**
 * Statistics about the wine database
 */
export interface WineStats {
  totalWines: number
  countriesCount: number
  typeCount: number
  avgPrice: number
  wineGrowth?: number
  countryDistribution: CountryDistribution[]
  typeDistribution: TypeDistribution[]
  priceRanges: PriceRange[]
  grapeDistribution: GrapeDistribution[]
  vintageDistribution: VintageDistribution[]
}

/**
 * Country distribution data
 */
export interface CountryDistribution {
  country: string
  count: number
  percentage: number
}

/**
 * Wine type distribution data
 */
export interface TypeDistribution {
  type: string
  count: number
  percentage: number
  styles?: {
    style: string
    count: number
  }[]
}

/**
 * Price range distribution data
 */
export interface PriceRange {
  range: string
  count: number
  percentage: number
}

/**
 * Grape distribution data
 */
export interface GrapeDistribution {
  grape: string
  count: number
  percentage: number
}

/**
 * Vintage distribution data
 */
export interface VintageDistribution {
  vintage: number | null
  count: number
  percentage: number
}

/**
 * API response format for wine list
 */
export interface WineListResponse {
  wines: Wine[]
  total: number
  page: number
  limit: number
}

/**
 * Filter options available in the database
 */
export interface FilterOptions {
  countries: string[]
  types: string[]
  styles: string[]
  grapes: string[]
  regions: string[]
  priceRange: {
    min: number
    max: number
  }
  abvRange: {
    min: number
    max: number
  }
  vintages: (number | null)[]
}

// src/types/wine.ts

/**
 * One entry in the heatmap’s bucket_map.
 */
export interface BucketMapItem {
  /** lower bound of the price range */
  price_min: number
  /** upper bound of the price range */
  price_max: number
  /** lower bound of the points (rating) range */
  points_min: number
  /** upper bound of the points (rating) range */
  points_max: number
  /** number of wines in this bucket */
  count: number
  /** average price of wines in this bucket */
  avg_price: number
  /** human-readable price range, e.g. "$10–20" */
  price_range: string
  /** most common varieties in this bucket */
  top_varieties: Array<{
    variety: string
    count: number
  }>
  /** sample wines for tooltips or detail views */
  examples: Array<{
    name: string
    price: number
    points: number
    winery: string
  }>
}

/**
 * The full heatmap response from the API.
 * Notice we now reuse BucketMapItem here.
 */
export interface HeatmapResponse {
  data: number[][] // [xIndex, yIndex, count]
  x_categories: number[] // price buckets
  y_categories: number[] // points buckets
  /** lookup table of bucket metadata keyed by `"price_min-points_min"` */
  bucket_map: Record<string, BucketMapItem>
  max_count: number
  total_wines: number
  bucket_size: { price: number; points: number }
}

export interface WineScatterPoint {
  price: number
  points: number
  title: string
}
