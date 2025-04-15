import type { JSX } from 'react'
import './Footer.css'

/**
 * Footer component for the application
 * @returns {JSX.Element} The Footer component
 */
function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>© {currentYear} WineWiz. Ett projekt för Webbteknik 2.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
