import React from 'react'
import SearchWines from '../components/visualizations/searchWines/SearchWines.js'

const SearchPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Sök viner</h1>
      <SearchWines />
    </div>
  )
}

export default SearchPage
