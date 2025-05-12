import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import type { JSX } from 'react'
import Home from './pages/home/Home.js'
import Dashboard from './pages/dashboard/DashboardPage.js'
import SearchPage from './pages/SearchPage.js'
import SearchWithRagPage from './pages/SearchWithRagPage.js'
import Navbar from './components/navbar/Navbar.js'
import Footer from './components/footer/Footer.js'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
/**
 * Main App component that handles routing and layout
 * @returns {JSX.Element} The App component
 */

const queryClient = new QueryClient()

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={import.meta.env.BASE_URL}>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/search-with-rag" element={<SearchWithRagPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
