// components/BotonesAccion.jsx
import React from 'react'

const BotonesAccion = ({ onEjecutar, onReiniciar, onAnterior, onSiguiente }) => (
  <>
    <div className="button-group">
      <button className="btn btn-success" onClick={onEjecutar}>
        <i className="fas fa-play"></i> Ejecutar
      </button>
      <button className="btn btn-warning" onClick={onReiniciar}>
        <i className="fas fa-refresh"></i> Reiniciar
      </button>
    </div>

    <div className="button-group mt-2">
      <button className="btn btn-secondary" onClick={onAnterior}>
        <i className="fas fa-step-backward"></i> Anterior
      </button>
      <button className="btn btn-primary" onClick={onSiguiente}>
        <i className="fas fa-step-forward"></i> Siguiente
      </button>
    </div>
  </>
)

export default BotonesAccion
