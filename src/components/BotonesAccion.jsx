// components/BotonesAccion.jsx
// Importa React para crear el componente
import React from 'react'

// Componente funcional que renderiza los botones de control
// Recibe como props las funciones callback que se ejecutarán al hacer clic en cada botón
const BotonesAccion = ({ onEjecutar, onReiniciar, onAnterior, onSiguiente }) => (
  // Fragment de React (<>) para agrupar elementos sin crear un div contenedor adicional
  <>
    {/* Primer grupo de botones: Ejecutar y Reiniciar */}
    <div className="button-group">
      {/* Botón Ejecutar - Inicia la ejecución del código */}
      <button className="btn btn-success" onClick={onEjecutar}>
        <i className="fas fa-play"></i> Ejecutar
      </button>
      
      {/* Botón Reiniciar - Resetea la visualización al estado inicial */}
      <button className="btn btn-warning" onClick={onReiniciar}>
        <i className="fas fa-refresh"></i> Reiniciar
      </button>
    </div>

    {/* Segundo grupo de botones: Navegación paso a paso */}
    {/* mt-2 añade margen superior para separar los grupos */}
    <div className="button-group mt-2">
      {/* Botón Anterior - Retrocede un paso en la ejecución */}
      <button className="btn btn-secondary" onClick={onAnterior}>
        <i className="fas fa-step-backward"></i> Anterior
      </button>
      
      {/* Botón Siguiente - Avanza un paso en la ejecución */}
      <button className="btn btn-primary" onClick={onSiguiente}>
        <i className="fas fa-step-forward"></i> Siguiente
      </button>
    </div>
  </>
)

// Exporta el componente como default para poder importarlo en otros archivos
export default BotonesAccion