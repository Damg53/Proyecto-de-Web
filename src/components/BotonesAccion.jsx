// components/BotonesAccion.jsx
// Importa React para crear el componente
import React from 'react';

// Componente funcional que renderiza los botones de control
// Recibe como props las funciones callback que se ejecutarán al hacer clic en cada botón
const BotonesAccion = ({ onEjecutar, onReiniciar, onAnterior, onSiguiente }) => (
  // Fragment de React (<>) para agrupar elementos sin crear un div contenedor adicional
  <>
    {/* Indicador de atajos de teclado */}
    <div className="mb-2 p-2 bg-dark text-white rounded" style={{ fontSize: '1.1rem' }}>
      <strong>⌨️ Atajos de teclado:</strong>
      <div className="mt-1">
        <span className="badge bg-success me-1">Enter</span>  Ejecutar /
        <span className="badge bg-warning ms-2 me-1">R</span>  Reiniciar /
        <span className="badge bg-info ms-2 me-1">C</span>  Consejos 
      </div>
      <div className="mt-1">
        <span className="badge bg-secondary me-1">←</span> Anterior / 
        <span className="badge bg-primary ms-2 me-1">→</span>   Siguiente
      </div>
    </div>

    {/* Primer grupo de botones: Ejecutar y Reiniciar */}
    <div className="button-group">
      {/* Botón Ejecutar - Inicia la ejecución del código */}
      <button 
        className="btn btn-success" 
        onClick={onEjecutar}
        title="Ejecutar código (Enter)"
      >
        <i className="fas fa-play"></i> Ejecutar
        <small className="d-block" style={{ fontSize: '1.1rem' }}>(Enter)</small>
      </button>
        
      {/* Botón Reiniciar - Resetea la visualización al estado inicial */}
      <button 
        className="btn btn-warning" 
        onClick={onReiniciar}
        title="Reiniciar (R)"
      >
        <i className="fas fa-refresh"></i> Reiniciar
        <small className="d-block" style={{ fontSize: '1.1rem' }}>(R)</small>
      </button>
    </div>

    {/* Segundo grupo de botones: Navegación paso a paso */}
    {/* mt-2 añade margen superior para separar los grupos */}
    <div className="button-group mt-2">
      {/* Botón Anterior - Retrocede un paso en la ejecución */}
      <button 
        className="btn btn-secondary" 
        onClick={onAnterior}
        title="Paso anterior (←)"
      >
        <i className="fas fa-step-backward"></i> Anterior
        <small className="d-block" style={{ fontSize: '1.1rem' }}>(←)</small>
      </button>
        
      {/* Botón Siguiente - Avanza un paso en la ejecución */}
      <button 
        className="btn btn-primary" 
        onClick={onSiguiente}
        title="Paso siguiente (→) "
      >
        <i className="fas fa-step-forward"></i> Siguiente
        <small className="d-block" style={{ fontSize: '1.1rem' }}>(→)</small>
      </button>
    </div>
  </>
);

// Exporta el componente como default para poder importarlo en otros archivos
export default BotonesAccion;