# 🍷 WT2 – Wine Explorer **Frontend**

> An interactive React + Vite application for exploring 130 000 wine reviews through maps, charts and AI‑powered search.

[Live demo](https://angelicamarker.online/wt2-frontend) • [Backend API](https://angelicamarker.online/wt2) • [OpenAPI docs](https://angelicamarker.online/wt2/docs)

---

## ✨ Highlight Features

- **Interactive Map Visualization** - Explore wine data by country with an interactive world map
- **Price vs. Rating Analysis** - Analyze the relationship between wine prices and ratings
- **Powerful Search** - Search wines by country, variety, price range, and points
- **Natural Language Search** - Ask questions about wines using the RAG-powered search interface
- **Responsive Design** - Works on desktop and mobile devices

### 🌍 WorldMap (Apache ECharts)

The WorldMap component provides an interactive choropleth visualization of global wine data:

- **Country-based coloring** based on average wine rating scores
- **Interactive tooltips** showing detailed country statistics:
  - Average rating
  - Wine count
  - Average price
  - Top varieties with percentage breakdowns
- **Click interaction** to filter and display wines from a specific country
- **Data caching** with React Query (5-minute stale time, 30-minute garbage collection)
- **Loading states** with appropriate fallbacks and error handling

### 📊 ScatterPlot (Apache ECharts)

The WineScatterPlot component visualizes the relationship between wine prices and ratings:

- **Interactive point clusters** showing wines within specific price and rating ranges
- **Zoom functionality** for exploring dense data areas
- **Click interaction** to view wines within a specific bucket
- **Data pagination** to load large datasets efficiently
- **Optimized performance** with React Query caching (5-minute stale time)
- **Detailed wine information** available through modal views

This visualization helps users identify value opportunities and understand price-quality relationships across the wine dataset.

### 👀 **Search Wine**

The SearchWines component provides a powerful interface for finding specific wines:

- **Full-text search** for descriptions and names
- **Advanced filtering** by country, variety, price range, and rating
- **Pagination** for browsing large result sets
- **Responsive design** for mobile and desktop use
- **Wine card display** with key information
- **Detail view** with complete wine information

### 🔍 AI‑powered Search

The SearchWithRag component offers a conversational interface to the wine database:

- **Natural language queries** - ask questions in plain English
- **Retrieval Augmented Generation (RAG)** using vector embeddings
- **AI-powered answers** with context-aware responses
- **Source citations** showing the wines referenced in the answer
- **Clickable recommendations** to explore specific wines
- **Optimized for wine domain questions** about regions, varieties, characteristics, etc.

Example queries:

- "What are the best wines under $30?"
- "Which country produces the highest-rated Cabernet Sauvignon?"
- "What's the difference between wines from France and Italy?"

---

## 📋 Project Structure

```
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/          # Images and icons
│   ├── components/      # React components
│   │   ├── footer/      # Footer component
│   │   ├── navbar/      # Navigation bar
│   │   └── visualizations/  # Visualization components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── types/           # TypeScript type definitions
├── .dockerignore        # Docker ignore file
├── .gitignore           # Git ignore file
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
└── package.json         # Project dependencies

```

## ## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Local Development

1. Clone the repository

   bash

   ```bash
   git clone https://github.com/MarkerAnn/wine_frontend.git
   cd wine_frontend
   ```

2. Install dependencies

   bash

   ```bash
   npm install
   ```

3. Create a `.env` file with the backend API URL

   ```
   VITE_API_URL=https://angelicamarker.online/wt2/
   ```

4. Start the development server

   bash

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173/](http://localhost:5173/) in your browser

### Building for Production

bash

```bash
npm run build
```

### Docker Deployment

The project includes Docker configuration for easy deployment:

bash

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build and run the Docker image directly
docker build -t wine-frontend .
docker run -p 3000:80 wine-frontend
```

## 🛠️ Technology Stack

- **Framework**: React 19 with TypeScript
- **Routing**: React Router 7
- **State Management**: React Query for server state
  - Smart caching strategy (5-minute stale time, 30-minute garbage collection)
  - Disabled window-focus and mount refetching for better performance
  - Efficient data invalidation and updates
- **Styling**: Tailwind CSS 4
- **Visualization**: ECharts
  - Interactive charts with tooltips
  - Map visualizations with click interactions
  - Scatter plots with zoom functionality
- **Building**: Vite 6
- **API Communication**: Axios
- **Containerization**: Docker

## 🔄 Integration with Backend

This frontend connects to the [Wine API Backend](https://angelicamarker.online/wt2/), a FastAPI service that provides:

- REST endpoints for wine data
- Text search capabilities
- Advanced statistics and aggregations
- Retrieval-Augmented Generation (RAG) for natural language queries

The backend exposes its API documentation at [https://angelicamarker.online/wt2/docs](https://angelicamarker.online/wt2/docs).

---

## 📝 License

MIT © 2025 Angelica Marker
