import { Link } from 'react-router-dom'
import type { JSX } from 'react'
import './Home.css'

/**
 * Home page component - landing page for the wine visualization app
 * @returns {JSX.Element} The Home component
 */
function Home(): JSX.Element {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Explore 130,000 Wine Reviews</h1>
        <p className="hero-description">
          Dive into a curated collection of global wine reviews. Analyze trends
          in ratings, prices, grape varieties, and wine regions through
          interactive visualizations.
        </p>
        <img
          src={import.meta.env.BASE_URL + 'images/barrels_basement.jpg'}
          alt="Wine barrels in a basement"
          className="hero-image"
        />
        <Link to="/dashboard" className="cta-button">
          Start Exploring
        </Link>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h2 className="feature-title">Data-Driven Insights</h2>
          <p className="feature-text">
            Discover patterns in wine ratings, price distributions, and reviewer
            preferences.
          </p>
        </div>
        <div className="feature-card">
          <h2 className="feature-title">Global Coverage</h2>
          <p className="feature-text">
            Analyze wines from top-producing countries and famous wine regions.
          </p>
        </div>
        <div className="feature-card">
          <h2 className="feature-title">Smart Filtering</h2>
          <p className="feature-text">
            Filter wines by country, grape variety, points, and price to tailor
            your view.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
