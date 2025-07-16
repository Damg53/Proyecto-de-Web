// TutorVisual.jsx - Versión actualizada con consejos solo bajo demanda
import React, { useState, useEffect } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Importa los componentes personalizados
import SelectorEstructura from '../components/SelectorEstructura';
import EditorCodigo from '../components/EditorCodigo';
import BotonesAccion from '../components/BotonesAccion';
import CanvasVisual from '../components/CanvasVisual';
import PanelInformacion from '../components/PanelInformacion';
import BotonTutorial from '../components/BotonTutorial';

// Importa la configuración del tutorial
import { iniciarTutorial, mostrarConsejo } from '../utils/tutorialConfig';

import './tutor.css';

const estructuras = ['Vector', 'Matriz', 'Pila', 'Cola', 'Lista', 'Arboles', 'Grafos'];

const TutorVisual = () => {
  const [estructuraSeleccionada, setEstructuraSeleccionada] = useState('');
  const [codigo, setCodigo] = useState('');
  const [primeraVez, setPrimeraVez] = useState(true);
  const [mostrarConsejos, setMostrarConsejos] = useState(false); // Estado para controlar consejos

  // Efecto para mostrar tutorial automáticamente en la primera visita
  useEffect(() => {
    const yaVioTutorial = localStorage.getItem('tutorialVisto');
    
    if (!yaVioTutorial && primeraVez) {
      // Pequeño delay para que los elementos se rendericen
      setTimeout(() => {
        iniciarTutorial();
        localStorage.setItem('tutorialVisto', 'true');
        setPrimeraVez(false);
      }, 1000);
    }
  }, [primeraVez]);

  // Función para manejar cambio de estructura
  const handleEstructuraChange = (e) => {
    const nuevaEstructura = e.target.value;
    setEstructuraSeleccionada(nuevaEstructura);
    
    // Solo mostrar consejo si el usuario ha habilitado los consejos
    if (nuevaEstructura && mostrarConsejos) {
      setTimeout(() => {
        mostrarConsejo(
          '.code-editor',
          `¡Genial! Has seleccionado ${nuevaEstructura}`,
          `Ahora puedes empezar a programar operaciones específicas para ${nuevaEstructura}. ¡Manos a la obra!`
        );
      }, 500);
    }
  };

  // Funciones para los botones de acción
  const handleEjecutar = () => {
    if (!codigo.trim()) {
      // Solo mostrar consejo si están habilitados
      if (mostrarConsejos) {
        mostrarConsejo(
          '.code-editor',
          'Código vacío',
          'Escribe algo de código antes de ejecutar. ¡No seas tímido, experimenta!'
        );
      }
      return;
    }
    
    if (!estructuraSeleccionada) {
      // Solo mostrar consejo si están habilitados
      if (mostrarConsejos) {
        mostrarConsejo(
          '.selector-estructura',
          'Selecciona una estructura',
          'Primero elige qué estructura de datos quieres usar para tu código.'
        );
      }
      return;
    }

    console.log("Ejecutando código:", codigo);
    // Aquí iría tu lógica de ejecución
  };

  const handleReiniciar = () => {
    setCodigo('');
    // Solo mostrar consejo si están habilitados
    if (mostrarConsejos) {
      mostrarConsejo(
        '.info-panel',
        'Reiniciado',
        'El código y la visualización han sido reiniciados. ¡Listo para un nuevo intento!'
      );
    }
  };

  const handleAnterior = () => {
    console.log("Paso anterior");
    // Lógica para paso anterior
  };

  const handleSiguiente = () => {
    console.log("Paso siguiente");
    // Lógica para paso siguiente
  };

  // Función para alternar el estado de los consejos
  const toggleConsejos = () => {
    setMostrarConsejos(!mostrarConsejos);
  };

  return (
    <div className="container-fluid tutor-container">
      <div className="row">
        {/* Panel de control izquierdo */}
        <div className="col-md-3 control-panel">
          <h3 className="text-white">Tutor de Estructuras de Datos</h3>
          
          {/* Control de consejos - Switch de bombillo */}
          <div className="mb-3">
            <div className="consejos-switch-container">
              <label className="consejos-switch">
                <input 
                  type="checkbox" 
                  checked={mostrarConsejos}
                  onChange={toggleConsejos}
                />
                <span className="consejos-slider">
                  <span className="bombillo-icon">
                    💡
                  </span>
                </span>
              </label>
              <span className="consejos-label">
                {mostrarConsejos ? 'Consejos activados' : 'Consejos desactivados'}
              </span>
            </div>
          </div>

          {/* Botón de tutorial con estructura seleccionada */}
          <BotonTutorial estructuraSeleccionada={estructuraSeleccionada} />

          {/* Selector de estructura con clase para targeting */}
          <div className="selector-estructura">
            <SelectorEstructura
              estructuras={estructuras}
              valor={estructuraSeleccionada}
              onChange={handleEstructuraChange}
            />
          </div>

          {/* Editor de código */}
          <EditorCodigo
            valor={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />

          {/* Botones de acción */}
          <BotonesAccion
            onEjecutar={handleEjecutar}
            onReiniciar={handleReiniciar}
            onAnterior={handleAnterior}
            onSiguiente={handleSiguiente}
          />
        </div>

        {/* Panel de visualización derecho */}
        <div className="col-md-9 visualization-panel">
          {/* Canvas para visualización */}
          <CanvasVisual />
          
          {/* Panel de información */}
          <PanelInformacion 
            descripcion={
              estructuraSeleccionada 
                ? `Trabajando con ${estructuraSeleccionada}. ${codigo ? 'Ejecuta tu código para ver la magia!' : 'Escribe algo de código para empezar.'}`
                : "Selecciona una estructura de datos y escribe código para ver la visualización aquí."
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TutorVisual;