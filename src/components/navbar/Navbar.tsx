import { useState } from 'react'
import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

/**
 * Navigation bar component
 * @returns {JSX.Element} The Navbar component
 */
function Navbar(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo and site name */}
          <Link to="/" className="navbar-logo">
            <span className="logo-text">WineWiz</span>
          </Link>

          {/* Desktop navigation */}
          <div className="desktop-menu">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/search" className="nav-link">
              Search Wines
            </Link>
            <Link to="/search-with-rag" className="nav-link">
              Search with RAG
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="mobile-button">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="nav-link"
              aria-label="Toggle menu"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link">
              Home
            </Link>
            <Link to="/dashboard" className="mobile-link">
              Dashboard
            </Link>
            <Link to="/search" className="mobile-link">
              Search Wines
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
