// components/CanvasVisual.jsx
import React from 'react'

const CanvasVisual = () => (
  <div className="visualization-container">
    <canvas id="visualizationCanvas" width="800" height="600"></canvas>
    <div id="loadingIndicator" className="loading-indicator d-none">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  </div>
)

export default CanvasVisual
