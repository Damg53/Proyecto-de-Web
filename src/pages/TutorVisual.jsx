// TutorVisual.jsx - Versión completa con soporte para listas y árboles
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

// Importa el interpretador de estructuras con soporte completo
import { InterpretadorEstructuras } from "../utils/index.js";

import './tutor.css';

// Estructuras disponibles incluyendo árboles
const estructuras = ['Vector', 'Matriz', 'Pila', 'Cola', 'Lista', 'Arboles', 'Grafos'];

const TutorVisual = () => {
  const [estructuraSeleccionada, setEstructuraSeleccionada] = useState('');
  const [codigo, setCodigo] = useState('');
  const [primeraVez, setPrimeraVez] = useState(true);
  const [mostrarConsejos, setMostrarConsejos] = useState(false);
  
  // Estados para el intérprete y visualización
  const [interprete] = useState(new InterpretadorEstructuras());
  const [estadoVisualizacion, setEstadoVisualizacion] = useState(null);
  const [modoEjecucion, setModoEjecucion] = useState('completo'); // 'completo' o 'paso_a_paso'
  const [mensajeEjecutor, setMensajeEjecutor] = useState('');

  // Efecto para mostrar tutorial automáticamente en la primera visita
  useEffect(() => {
    const yaVioTutorial = localStorage.getItem('tutorialVisto');
    
    if (!yaVioTutorial && primeraVez) {
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
    
    // Reiniciar el intérprete cuando cambia la estructura
    interprete.reiniciar();
    setEstadoVisualizacion(null);
    setMensajeEjecutor('');
    
    // Actualizar código de ejemplo según la estructura
    if (nuevaEstructura === 'Vector') {
        setCodigo('int arr = new int[5];\narr[0] = 10;\narr[1] = 20;\narr[2] = 30;');
    } else if (nuevaEstructura === 'Matriz') {
        setCodigo('int mat = new int[3][3];\nmat[0][0] = 1;\nmat[1][1] = 5;\nmat[2][2] = 9;');
    } else if (nuevaEstructura === 'Lista') {
        // Código de ejemplo para lista doblemente enlazada
        setCodigo(`ListaDoble miLista = new ListaDoble();
miLista.insertarInicio("A");
miLista.insertarFinal("B");
miLista.insertarEn(1, "C");
miLista.eliminarInicio();
miLista.eliminarEn(0);`);
    } else if (nuevaEstructura === 'Arboles') {
        // Código de ejemplo para árbol binario
        setCodigo(`BOF = new ArbolBinario(); 
BOF.insertar(50);
BOF.insertar(30);
BOF.insertar(20);
BOF.insertar(40);
BOF.insertar(60);
BOF.insertar(80);
BOF.insertar(70);
BOF.insertar(90);
BOF.buscar(40);
BOF.inorder();`);
    } else {
        setCodigo('');
    }
    
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

  // Función para ejecutar código completo
  const handleEjecutar = () => {
    if (!codigo.trim()) {
      if (mostrarConsejos) {
        mostrarConsejo(
          '.code-editor',
          'Código vacío',
          'Escribe algo de código antes de ejecutar. ¡No seas tímido, experimenta!'
        );
      }
      setMensajeEjecutor('Error: No hay código para ejecutar');
      return;
    }
    
    if (!estructuraSeleccionada) {
      if (mostrarConsejos) {
        mostrarConsejo(
          '.selector-estructura',
          'Selecciona una estructura',
          'Primero elige qué estructura de datos quieres usar para tu código.'
        );
      }
      setMensajeEjecutor('Error: Selecciona una estructura de datos');
      return;
    }

    try {
      // Cargar y ejecutar el código
      interprete.cargarCodigo(codigo);
      const resultado = interprete.ejecutarTodo();
      
      setEstadoVisualizacion(resultado);
      setModoEjecucion('completo');
      setMensajeEjecutor('Código ejecutado exitosamente');
      
      console.log("Resultado de ejecución:", resultado);
      
    } catch (error) {
      setMensajeEjecutor(`Error en la ejecución: ${error.message}`);
      console.error("Error al ejecutar código:", error);
    }
  };

  // Función para reiniciar
  const handleReiniciar = () => {
    interprete.reiniciar();
    setEstadoVisualizacion(null);
    setMensajeEjecutor('');
    setCodigo('');
    
    if (mostrarConsejos) {
      mostrarConsejo(
        '.info-panel',
        'Reiniciado',
        'El código y la visualización han sido reiniciados. ¡Listo para un nuevo intento!'
      );
    }
  };

  // Función para paso anterior
  const handleAnterior = () => {
    if (!estadoVisualizacion) {
      setMensajeEjecutor('Primero debes ejecutar el código');
      return;
    }

    try {
      // Si estamos en modo completo, cambiar a paso a paso y cargar código
      if (modoEjecucion === 'completo') {
        interprete.reiniciar();
        interprete.cargarCodigo(codigo);
        setModoEjecucion('paso_a_paso');
      }
      
      const resultado = interprete.ejecutarPasoAnterior();
      if (resultado) {
        setEstadoVisualizacion(resultado);
        setMensajeEjecutor(`Paso anterior ejecutado. Paso ${resultado.pasoActual}/${resultado.totalPasos}`);
      } else {
        setMensajeEjecutor('No hay pasos anteriores disponibles');
      }
      
    } catch (error) {
      setMensajeEjecutor(`Error en paso anterior: ${error.message}`);
    }
  };

  // Función para paso siguiente
  const handleSiguiente = () => {
    if (!codigo.trim()) {
      setMensajeEjecutor('Error: No hay código para ejecutar');
      return;
    }

    try {
      // Si estamos en modo completo, cambiar a paso a paso y cargar código
      if (modoEjecucion === 'completo') {
        interprete.reiniciar();
        interprete.cargarCodigo(codigo);
        setModoEjecucion('paso_a_paso');
      }
      
      const resultado = interprete.ejecutarSiguientePaso();
      if (resultado) {
        setEstadoVisualizacion(resultado);
        setMensajeEjecutor(`Paso ejecutado. Paso ${resultado.pasoActual}/${resultado.totalPasos}`);
      } else {
        setMensajeEjecutor('No hay más pasos para ejecutar');
      }
      
    } catch (error) {
      setMensajeEjecutor(`Error en paso siguiente: ${error.message}`);
    }
  };

  // Función para alternar el estado de los consejos
  const toggleConsejos = () => {
    setMostrarConsejos(!mostrarConsejos);
  };

  // Función para obtener la descripción del estado actual
  const obtenerDescripcion = () => {
    if (mensajeEjecutor) {
      return mensajeEjecutor;
    }
    
    if (estadoVisualizacion) {
      const { estructuras, pasoActual, totalPasos } = estadoVisualizacion;
      let descripcion = `Ejecutando ${estructuraSeleccionada}. `;
      
      if (modoEjecucion === 'paso_a_paso') {
        descripcion += `Paso ${pasoActual}/${totalPasos}. `;
      }
      
      if (estructuras.length > 0) {
        // Información específica según el tipo de estructura
        const nombres = estructuras.map(e => e.nombre).join(', ');
        
        if (estructuraSeleccionada === 'Arboles') {
          const arbol = estructuras.find(e => e.tipo === 'arbol');
          if (arbol) {
            const numNodos = arbol.nodos ? arbol.nodos.length : 0;
            descripcion += `Árbol '${arbol.nombre}' con ${numNodos} nodos`;
          }
        } else if (estructuraSeleccionada === 'Lista') {
          const lista = estructuras.find(e => e.tipo === 'listaDoble');
          if (lista) {
            const numElementos = lista.elementos ? lista.elementos.length : 0;
            descripcion += `Lista '${lista.nombre}' con ${numElementos} elementos`;
          }
        } else {
          descripcion += `Estructuras en memoria: ${nombres}`;
        }
      }
      
      return descripcion;
    }
    
    if (estructuraSeleccionada) {
      let mensaje = `Trabajando con ${estructuraSeleccionada}. `;
      
      if (estructuraSeleccionada === 'Arboles') {
        mensaje += codigo ? 'Ejecuta tu código para ver el árbol binario!' : 'Escribe operaciones para crear y manipular árboles.';
      } else if (estructuraSeleccionada === 'Lista') {
        mensaje += codigo ? 'Ejecuta tu código para ver la lista enlazada!' : 'Escribe operaciones para crear y manipular listas.';
      } else {
        mensaje += codigo ? 'Ejecuta tu código para ver la magia!' : 'Escribe algo de código para empezar.';
      }
      
      return mensaje;
    }
    
    return "Selecciona una estructura de datos y escribe código para ver la visualización aquí.";
  };

  // Función para obtener operaciones disponibles según la estructura
  
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

          {/* Indicador de modo de ejecución */}
          {estadoVisualizacion && (
            <div className="mt-3 p-2 bg-info text-white rounded">
              <small>
                Modo: {modoEjecucion === 'completo' ? 'Ejecución completa' : 'Paso a paso'}
                <br />
                Paso: {estadoVisualizacion.pasoActual}/{estadoVisualizacion.totalPasos}
                {estadoVisualizacion.estructuras && estructuraSeleccionada === 'Arboles' && (
                  <>
                    <br />
                    Nodos en memoria: {estadoVisualizacion.estructuras
                      .filter(e => e.tipo === 'arbol')
                      .reduce((total, arbol) => total + (arbol.nodos ? arbol.nodos.length : 0), 0)}
                  </>
                )}
              </small>
            </div>
          )}
        </div>

        {/* Panel de visualización derecho */}
        <div className="col-md-9 visualization-panel">
          {/* Canvas para visualización */}
          <CanvasVisual estadoVisualizacion={estadoVisualizacion} estructura={estructuraSeleccionada} />
          
          {/* Panel de información */}
          <PanelInformacion 
            descripcion={obtenerDescripcion()}
          />

          {/* Panel de ayuda contextual para árboles */}
          {estructuraSeleccionada === 'Arboles' && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6>💡 Consejos para Árboles Binarios:</h6>
              <ul className="mb-0">
                <li><small>Los valores menores van al hijo izquierdo</small></li>
                <li><small>Los valores mayores van al hijo derecho</small></li>
                <li><small>Los recorridos muestran diferentes órdenes de visita</small></li>
                <li><small>La búsqueda resalta el camino hasta el nodo encontrado</small></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorVisual;