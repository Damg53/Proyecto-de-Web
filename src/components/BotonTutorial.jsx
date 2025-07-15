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
    <div className="tutorial-container">
      {/* Botón principal del tutorial */}
      <button
        className="btn btn-primary"
        onClick={() => setMostrarOpciones(!mostrarOpciones)}
      >
        <i className="fas fa-question-circle"></i>
        Tutorial & Ayuda
        <i className={`fas fa-chevron-${mostrarOpciones ? 'up' : 'down'}`}></i>
      </button>

      {/* Menú desplegable de opciones */}
      {mostrarOpciones && (
        <div className="tutorial-options">
          <div className="tutorial-option-item">
            <button
              className="btn btn-secondary"
              onClick={handleTutorialGeneral}
            >
              <i className="fas fa-play-circle"></i>
              Tutorial Completo
            </button>
            <small>
              Recorrido completo por todas las funciones
            </small>
          </div>

          <div className="tutorial-option-item">
            <button
              className="btn btn-secondary"
              onClick={handleTutorialEstructura}
            >
              <i className="fas fa-code"></i>
              Ayuda Específica
            </button>
            <small>
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
            >
              <i className="fas fa-lightbulb"></i>
              Consejos Rápidos
            </button>
            <small>
              Tips básicos de programación
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotonTutorial;