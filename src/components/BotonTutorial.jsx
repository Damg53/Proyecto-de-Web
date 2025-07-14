// components/BotonTutorial.jsx
import React, { useState } from 'react';
import { iniciarTutorial, tutorialEstructura, mostrarConsejo } from '../utils/tutorialConfig';

const BotonTutorial = ({ estructuraSeleccionada }) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  // Función para manejar el tutorial general
  const handleTutorialGeneral = () => {
    iniciarTutorial();
    setMostrarOpciones(false);
  };

  // Función para manejar tutorial específico de estructura
  const handleTutorialEstructura = () => {
    if (estructuraSeleccionada) {
      tutorialEstructura(estructuraSeleccionada);
    } else {
      mostrarConsejo(
        '.selector-estructura',
        'Selecciona una estructura',
        'Primero elige una estructura de datos para obtener ayuda específica sobre ella.'
      );
    }
    setMostrarOpciones(false);
  };

  // Función para mostrar consejos rápidos
  const handleConsejosRapidos = () => {
    mostrarConsejo(
      '.code-editor',
      'Consejos de Programación 💡',
      'Recuerda: declara variables, usa sintaxis correcta y no olvides los puntos y comas. ¡La práctica hace al maestro!'
    );
    setMostrarOpciones(false);
  };

  return (
    <div className="tutorial-container" style={{ position: 'relative', marginBottom: '1.5rem' }}>
      {/* Botón principal del tutorial */}
      <button
        className="btn btn-primary"
        onClick={() => setMostrarOpciones(!mostrarOpciones)}
        style={{
          width: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          border: 'none',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <i className="fas fa-question-circle"></i>
        Tutorial & Ayuda
        <i className={`fas fa-chevron-${mostrarOpciones ? 'up' : 'down'}`}></i>
      </button>

      {/* Menú desplegable de opciones */}
      {mostrarOpciones && (
        <div
          className="tutorial-options"
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1rem',
            marginTop: '0.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            zIndex: 1000,
            animation: 'fadeInDown 0.3s ease-out'
          }}
        >
          <div className="tutorial-option-item" style={{ marginBottom: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              onClick={handleTutorialGeneral}
              style={{
                width: '100%',
                padding: '0.6rem 1rem',
                background: 'rgba(71, 85, 105, 0.8)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-play-circle"></i>
              Tutorial Completo
            </button>
            <small style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
              Recorrido completo por todas las funciones
            </small>
          </div>

          <div className="tutorial-option-item" style={{ marginBottom: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              onClick={handleTutorialEstructura}
              style={{
                width: '100%',
                padding: '0.6rem 1rem',
                background: 'rgba(71, 85, 105, 0.8)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-code"></i>
              Ayuda Específica
            </button>
            <small style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
              {estructuraSeleccionada ? 
                `Consejos para ${estructuraSeleccionada}` : 
                'Selecciona una estructura primero'
              }
            </small>
          </div>

          <div className="tutorial-option-item">
            <button
              className="btn btn-secondary"
              onClick={handleConsejosRapidos}
              style={{
                width: '100%',
                padding: '0.6rem 1rem',
                background: 'rgba(71, 85, 105, 0.8)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-lightbulb"></i>
              Consejos Rápidos
            </button>
            <small style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
              Tips básicos de programación
            </small>
          </div>
        </div>
      )}

      {/* Estilos para la animación */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tutorial-options button:hover {
          background: rgba(71, 85, 105, 1) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .tutorial-container button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default BotonTutorial;