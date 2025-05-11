import React from 'react'
import SearchWithRag from '../components/visualizations/searchWithRag/SearchWithRag.js'

const SearchWithRagPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Search Wines</h1>
      <SearchWithRag />
    </div>
  )
}

export default SearchWithRagPage
