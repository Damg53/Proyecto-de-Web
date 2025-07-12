// components/CanvasVisual.jsx
// Importa React para crear el componente
import React from 'react'

// Componente funcional que renderiza el área de visualización gráfica
const CanvasVisual = () => (
  // Contenedor principal para la visualización
  <div className="visualization-container">
    {/* 
      Elemento Canvas HTML5 para dibujar las estructuras de datos
      - id: identificador único para acceder desde JavaScript
      - width/height: dimensiones del canvas en píxeles
      - Se usará para renderizar gráficamente las estructuras (vectores, matrices, árboles, etc.)
    */}
    <canvas id="visualizationCanvas" width="800" height="600"></canvas>
    
    {/* 
      Indicador de carga que aparece mientras se procesa la visualización
      - id: identificador único para controlar su visibilidad
      - d-none: clase de Bootstrap que oculta el elemento por defecto
      - Se mostrará/ocultará dinámicamente durante las operaciones
    */}
    <div id="loadingIndicator" className="loading-indicator d-none">
      {/* 
        Spinner de Bootstrap para mostrar animación de carga
        - spinner-border: clase que crea la animación rotatoria
        - text-primary: color azul del tema de Bootstrap
        - role="status": indica que es un elemento de estado para accesibilidad
      */}
      <div className="spinner-border text-primary" role="status">
        {/* 
          Texto para lectores de pantalla (accesibilidad)
          - sr-only: solo visible para screen readers
        */}
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  </div>
)

// Exporta el componente como default para poder importarlo en otros archivos
export default CanvasVisual