// import React, { useState } from 'react'
// import { useCountryStats } from '../../../hooks/useCountryStats.js'
// import {
//   usePriceRatingData,
//   PriceRatingFilters,
//   PriceRatingDataPoint,
// } from '../../../hooks/usePriceRatingData.js'
// import WorldMap from '../../visualizations/worldMap/WorldMap.js'
// import PriceRatingScatter from '../../visualizations/priceRatingScatter/PriceRatingScatter.js'

// /**
//  * Main dashboard component that displays multiple visualizations
//  */
// const Dashboard: React.FC = () => {
//   // State for filters
//   const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
//   const [priceRatingFilters, setPriceRatingFilters] =
//     useState<PriceRatingFilters>({
//       pageSize: 1000,
//     })

//   // Fetch data using our custom hooks
//   const { countryStats, loading: loadingMap } = useCountryStats()
//   const { data: priceRatingData, loading: loadingScatter } =
//     usePriceRatingData(priceRatingFilters)

//   // Handle country selection from the map
//   const handleCountrySelect = (country: string) => {
//     setSelectedCountry(country === selectedCountry ? null : country)

//     // Update filters for the scatterplot
//     setPriceRatingFilters((prev) => ({
//       ...prev,
//       country: country === selectedCountry ? undefined : country,
//     }))
//   }

//   // Handle clicking on a point in the scatterplot
//   const handlePointClick = (dataPoint: PriceRatingDataPoint) => {
//     console.log('Selected wine:', dataPoint)
//     // Here you could show a modal with details, navigate to a detail page, etc.
//   }

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8">
//       <header className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
//         <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:mb-0 sm:text-3xl">
//           Wine Explorer Dashboard
//         </h1>
//         {selectedCountry && (
//           <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
//             Filtering by: {selectedCountry}
//             <button
//               className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-200"
//               onClick={() => handleCountrySelect(selectedCountry)}
//             >
//               Clear
//             </button>
//           </div>
//         )}
//       </header>

//       <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
//         <div className="rounded-lg bg-white p-4 shadow-md">
//           <h2 className="mb-4 text-xl font-semibold text-gray-700">
//             Global Wine Ratings
//           </h2>
//           <WorldMap
//             countryStats={countryStats}
//             loading={loadingMap}
//             selectedCountry={selectedCountry}
//             onCountrySelect={handleCountrySelect}
//           />
//         </div>

//         <div className="rounded-lg bg-white p-4 shadow-md">
//           <h2 className="mb-4 text-xl font-semibold text-gray-700">
//             Price vs. Rating Analysis
//           </h2>
//           <PriceRatingScatter
//             data={priceRatingData}
//             loading={loadingScatter}
//             onPointClick={handlePointClick}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard
