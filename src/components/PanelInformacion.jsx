// components/PanelInformacion.jsx
import React from 'react'

const PanelInformacion = ({ descripcion }) => (
  <div className="info-panel">
    <div id="stepInfo" className="step-info">
      <h5>Información del paso:</h5>
      <p id="stepDescription">{descripcion}</p>
    </div>
  </div>
)

export default PanelInformacion
