// components/PanelInformacion.jsx
// Importa React para crear el componente
import React from 'react'

// Componente funcional que muestra información contextual sobre el paso actual
// Recibe como prop:
// - descripcion: texto descriptivo del paso o línea de código que se está ejecutando
const PanelInformacion = ({ descripcion }) => (
  // Contenedor principal del panel de información
  <div className="info-panel">
    {/* 
      Sección específica para mostrar información del paso actual
      - id: identificador único para acceder desde JavaScript si es necesario
      - step-info: clase personalizada para estilos específicos
    */}
    <div id="stepInfo" className="step-info">
      {/* 
        Título del panel que permanece constante
        - h5: tamaño de encabezado apropiado para una sección
      */}
      <h5>Información del paso:</h5>
      
      {/* 
        Párrafo que muestra la descripción dinámica
        - id: identificador único para poder actualizar el contenido desde JavaScript
        - {descripcion}: renderiza la prop descripcion recibida del componente padre
        - Se actualiza dinámicamente según el paso de ejecución actual
      */}
      <p id="stepDescription">{descripcion}</p>
    </div>
  </div>
)

// Exporta el componente como default para poder importarlo en otros archivos
export default PanelInformacion