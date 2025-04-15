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
        <h1 className="hero-title">Discover the World of Wine</h1>
        <p className="hero-description">
          Explore our comprehensive database with over a thousand different
          wines. Filter, visualize, and gain insights about wines from around
          the world.
        </p>
        <img
          src="/images/barrels_basement.jpg"
          alt="Wine barrels in a basement"
          className="hero-image"
        />
        <Link to="/dashboard" className="cta-button">
          Explore Data
        </Link>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h2 className="feature-title">Interactive Visualizations</h2>
          <p className="feature-text">
            Explore wines through interactive charts and graphics.
          </p>
        </div>
        <div className="feature-card">
          <h2 className="feature-title">Global Database</h2>
          <p className="feature-text">
            Access data about wines from around the world.
          </p>
        </div>
        <div className="feature-card">
          <h2 className="feature-title">Advanced Filtering</h2>
          <p className="feature-text">
            Filter by grape, country, price, and much more.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
