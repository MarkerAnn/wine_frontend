/**
 * Type definitions for wine data
 */

/**
 * Represents a wine from the database
 */
// export interface Wine {
//   id: number
//   title: string
//   description: string
//   price: number
//   capacity: number | null
//   grape: string
//   secondary_grape_varieties: string | null
//   closure: string | null
//   country: string
//   unit: number | null
//   characteristics: string | null
//   per_unit: string | null
//   type: string
//   abv: number
//   region: string | null
//   style: string
//   vintage: number | null
//   appellation: string | null
//   currency: string
//   created_at: string
//   source: string
// }

export interface Wine {
  title: string
  description: string
  points: number
  price: number
  country: string
  province: string
  region_1: string
  region_2: string
  designation: string
  taster_name: string
  taster_twitter_handle: string
  variety: string
  winery: string
  id: number
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
 * One entry in the heatmap's bucket_map.
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

export interface WineScatterPoint {
  price: number
  points: number
  title: string
}

export interface WineInBucket {
  id: number
  name: string
  winery: string
  price: number
  points: number
  country?: string
  variety?: string
}

export interface BucketWinesPagination {
  next_cursor?: string
  has_next: boolean
}

export interface BucketWinesResponse {
  wines: WineInBucket[]
  pagination: BucketWinesPagination
  total: number
}

export interface WineExample {
  name: string
  price: number
  points: number
  winery: string
}

export interface PriceRatingBucket {
  price_min: number
  price_max: number
  points_min: number
  points_max: number
  count: number
  examples: WineExample[]
}

export interface AggregatedPriceRatingResponse {
  buckets: PriceRatingBucket[]
  total_wines: number
  total_buckets: number
  bucket_size: {
    price: number
    points: number
  }
}

export interface WineSearchRequest {
  search?: string
  country?: string
  variety?: string
  min_price?: number
  max_price?: number
  min_points?: number
  page: number
  size: number
}

export interface WineSearchResult {
  id: number
  title: string
  price?: number
  points: number
  country?: string
  variety?: string
  winery?: string
}

export interface WineSearchResponse {
  items: WineSearchResult[]
  total: number
  page: number
  size: number
  pages: number
}

export interface WinesByCountryResponse {
  country: string
  wines: WineSearchResult[]
  next_cursor: string | null
  has_next: boolean
}
