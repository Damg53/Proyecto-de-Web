// TutorVisual.jsx - Versión integrada con indicador de línea actual
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
import BotonComentarios from '../components/BotonComentarios';


// Importa la configuración del tutorial
import { iniciarTutorial, mostrarConsejo } from '../utils/tutorialConfig';

// Importa el interpretador de estructuras con soporte completo
import { InterpretadorEstructuras } from "../utils/index.js";

import './tutor.css';

// Estructuras disponibles incluyendo árboles
const estructuras = ['Vector', 'Matriz', 'Pila', 'Cola', 'Lista', 'Arboles', 'Grafos'];

// Función para calcular la línea actual basada en el paso
const calcularLineaActual = (codigo, pasoActual) => {
  if (!codigo || !pasoActual) return null;
  
  const lineas = codigo.split('\n');
  const lineasEjecutable = lineas
    .map((linea, index) => ({
      numero: index + 1,
      contenido: linea.trim()
    }))
    .filter(linea => 
      linea.contenido && 
      !linea.contenido.startsWith('//') && 
      !linea.contenido.startsWith('/*') &&
      linea.contenido !== '{'  &&
      linea.contenido !== '}'
    );
  
  if (pasoActual <= lineasEjecutable.length) {
    return lineasEjecutable[pasoActual - 1].numero;
  }
  
  return null;
};

const TutorVisual = () => {
  const [estructuraSeleccionada, setEstructuraSeleccionada] = useState('');
  const [codigo, setCodigo] = useState('');
  const [primeraVez, setPrimeraVez] = useState(true);
  const [mostrarConsejos, setMostrarConsejos] = useState(false);
  
  // Estados para el intérprete y visualización
  const [interprete] = useState(new InterpretadorEstructuras());
  const [estadoVisualizacion, setEstadoVisualizacion] = useState(null);
 const [modoEjecucion, setModoEjecucion] = useState('paso_a_paso'); // Cambiar de 'completo' a 'paso_a_paso'
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

  // Efecto para mostrar consejo cuando cambia la estructura seleccionada
  useEffect(() => {
    if (estructuraSeleccionada && mostrarConsejos) {
      console.log(`Efecto: Mostrando consejo para estructura: ${estructuraSeleccionada}`); // Debug
      setTimeout(() => {
        mostrarConsejoEducativo('seleccion', '.selector-estructura', estructuraSeleccionada);
      }, 300); // Delay más largo para asegurar que el DOM se actualice
    }
  }, [estructuraSeleccionada, mostrarConsejos]); // Dependencias del efecto

  // Función para obtener consejo educativo usando condicionales if
  const obtenerConsejoEducativo = (estructura, tipo) => {
    if (!estructura || !tipo) return null;

    // Consejos para Vector
    if (estructura === 'Vector') {
      if (tipo === 'seleccion') {
        return {
          titulo: '💡 Consejo sobre Vectores',
          descripcion: 'Los vectores son perfectos para acceso rápido por índice O(1). Ideales cuando necesitas acceder frecuentemente a elementos por posición específica.'
        };
      } else if (tipo === 'codigo') {
        return {
          titulo: '🎯 Tip de programación',
          descripcion: 'Prueba operaciones como: arr[i] = valor (asignación), arr.length (tamaño), o bucles for para recorrer todos los elementos.'
        };
      } else if (tipo === 'ejecucion') {
        return {
          titulo: '⚡ Optimización',
          descripcion: 'Los vectores usan memoria contigua, lo que los hace muy eficientes para operaciones matemáticas y procesamiento de datos grandes.'
        };
      }
    }

    // Consejos para Matriz
    if (estructura === 'Matriz') {
      if (tipo === 'seleccion') {
        return {
          titulo: '💡 Consejo sobre Matrices',
          descripcion: 'Las matrices son vectores bidimensionales. Perfectas para representar tablas, imágenes, o problemas de programación dinámica.'
        };
      } else if (tipo === 'codigo') {
        return {
          titulo: '🎯 Tip de programación',
          descripcion: 'Para matrices, siempre ten en cuenta las dimensiones: mat[fila][columna]. Usa bucles anidados para recorrer todos los elementos.'
        };
      } else if (tipo === 'ejecucion') {
        return {
          titulo: '⚡ Consideración de rendimiento',
          descripcion: 'Al recorrer matrices, es más eficiente hacerlo fila por fila debido a la localidad de referencia en memoria.'
        };
      }
    }

    // Consejos para Pila
    if (estructura === 'Pila') {
      if (tipo === 'seleccion') {
        return {
          titulo: '💡 Consejo sobre Pilas (Stack)',
          descripcion: 'Las pilas siguen LIFO: Last In, First Out. Imagina una pila de platos: solo puedes tomar el de arriba. Útiles para parsing, undo/redo.'
        };
      } else if (tipo === 'codigo') {
        return {
          titulo: '🎯 Tip de programación',
          descripcion: 'Operaciones principales: push(elemento) para agregar, pop() para quitar y obtener, peek()/top() para ver sin quitar.'
        };
      } else if (tipo === 'ejecucion') {
        return {
          titulo: '⚡ Casos de uso',
          descripcion: 'Las pilas son fundamentales en recursión, navegación de páginas web, y evaluación de expresiones matemáticas.'
        };
      }
    }

    // Consejos para Cola
    if (estructura === 'Cola') {
      if (tipo === 'seleccion') {
        return {
          titulo: '💡 Consejo sobre Colas (Queue)',
          descripcion: 'Las colas siguen FIFO: First In, First Out. Como una fila en el banco: quien llega primero, se atiende primero.'
        };
      } else if (tipo === 'codigo') {
        return {
          titulo: '🎯 Tip de programación',
          descripcion: 'Operaciones básicas: enqueue(elemento) para agregar al final, dequeue() para quitar del frente, front() para ver el primero.'
        };
      } else if (tipo === 'ejecucion') {
        return {
          titulo: '⚡ Aplicaciones prácticas',
          descripcion: 'Las colas son esenciales en sistemas operativos (procesos), redes (buffers), y algoritmos de búsqueda como BFS.'
        };
      }
    }

    // Consejos para Lista
    if (estructura === 'Lista') {
      if (tipo === 'seleccion') {
        return {
          titulo: '💡 Consejo sobre Listas Enlazadas',
          descripcion: 'Las listas enlazadas permiten inserción/eliminación eficiente en cualquier posición, pero requieren recorrido secuencial para acceso.'
        };
      } else if (tipo === 'codigo') {
        return {
          titulo: '🎯 Tip de programación',
          descripcion: 'Operaciones útiles: insertarInicio(), insertarFinal(), insertarEn(pos, elem), eliminarInicio(), eliminarEn(pos).'
        };
      } else if (tipo === 'ejecucion') {
        return {
          titulo: '⚡ Ventaja clave',
          descripcion: 'A diferencia de los arrays, las listas crecen dinámicamente sin desperdiciar memoria y permiten inserción O(1) al inicio.'
        };
      }
    }

    // Consejos para Arboles
    if (estructura === 'Arboles') {
      if (tipo === 'seleccion') {
        return {
          titulo: '💡 Consejo sobre Árboles Binarios',
          descripcion: 'Los árboles binarios organizan datos jerárquicamente. Cada nodo tiene máximo 2 hijos: izquierdo (menor) y derecho (mayor).'
        };
      } else if (tipo === 'codigo') {
        return {
          titulo: '🎯 Tip de programación',
          descripcion: 'Operaciones principales: insertar(valor), buscar(valor), inorder(), preorder(), postorder() para diferentes recorridos.'
        };
      } else if (tipo === 'ejecucion') {
        return {
          titulo: '⚡ Eficiencia increíble',
          descripcion: 'En un árbol balanceado, búsqueda, inserción y eliminación son O(log n) - mucho más rápido que listas para conjuntos grandes.'
        };
      }
    }

    // Consejos para Grafos
    if (estructura === 'Grafos') {
      if (tipo === 'seleccion') {
        return {
          titulo: '💡 Consejo sobre Grafos',
          descripcion: 'Los grafos modelan relaciones complejas entre elementos. Cada nodo puede conectarse con múltiples nodos a través de aristas.'
        };
      } else if (tipo === 'codigo') {
        return {
          titulo: '🎯 Tip de programación',
          descripcion: 'Operaciones base: agregarNodo(id), agregarArista(origen, destino, peso), bfs(inicio), dfs(inicio), dijkstra(origen, destino).'
        };
      } else if (tipo === 'ejecucion') {
        return {
          titulo: '⚡ Aplicaciones poderosas',
          descripcion: 'Los grafos resuelven problemas de redes sociales, rutas de navegación, dependencias de tareas, y optimización de caminos.'
        };
      }
    }

    // Si no se encuentra la estructura o tipo, retornar null
    return null;
  };

  // Función mejorada para mostrar consejo educativo específico
  const mostrarConsejoEducativo = (tipo, elemento = '.code-editor', estructuraEspecifica = null) => {
    // Usar la estructura específica pasada como parámetro, o la seleccionada actualmente
    const estructura = estructuraEspecifica || estructuraSeleccionada;
    
    if (!estructura || !mostrarConsejos) return;
    
    console.log(`Mostrando consejo para estructura: ${estructura}, tipo: ${tipo}`); // Debug
    
    const consejo = obtenerConsejoEducativo(estructura, tipo);
    if (consejo) {
      setTimeout(() => {
        mostrarConsejo(elemento, consejo.titulo, consejo.descripcion);
      }, 100);
    }
  };

  // Función para manejar cambio de estructura
  const handleEstructuraChange = (e) => {
    const nuevaEstructura = e.target.value;
    console.log(`Cambiando estructura a: ${nuevaEstructura}`); // Debug
    
    setEstructuraSeleccionada(nuevaEstructura);
    
    // Reiniciar el intérprete cuando cambia la estructura
    interprete.reiniciar();
    setEstadoVisualizacion(null);
    setMensajeEjecutor('');
    
    // Actualizar código de ejemplo según la estructura
    if (nuevaEstructura === 'Vector') {
        setCodigo('int BOF = new int[5];\nBOF[0] = 10;\nBOF[1] = 20;\nBOF[2] = 30;');
    } else if (nuevaEstructura === 'Matriz') {
        setCodigo('int BOF = new int[3][3];\nBOF[0][0] = 1;\nBOF[1][1] = 5;\nBOF[2][2] = 9;');
    } else if (nuevaEstructura === 'Pila') {
        // NUEVO: Código de ejemplo para pilas
        setCodigo(`Pila BOF = new Pila();
BOF.push("Libro1");
BOF.push("Libro2");
BOF.push("Libro3");
BOF.pop();`);
    } else if (nuevaEstructura === 'Cola') {
        // Código de ejemplo para cola
        setCodigo(
  "Queue<string> Bof = new Queue<string>();\n" +
  "Bof.Enqueue(\"Diego\");\n" +
  "Bof.Enqueue(\"Daniel\");\n" +
  "Bof.Enqueue(\"Kale\");\n" +
  "Bof.Dequeue();\n" +
  "Bof.Enqueue(\"Chayanne\");\n" +
  "Bof.Dequeue();\n" +
  "Bof.Enqueue(\"Jose\");\n" +
  "Bof.Dequeue();\n" +
  "Bof.Enqueue(\"Marco\");"
);

    } else if (nuevaEstructura === 'Lista') {
        // Código de ejemplo para lista doblemente enlazada
        setCodigo(`ListaDoble BOF = new ListaDoble();
BOF.insertarInicio("A");
BOF.insertarFinal("B");
BOF.insertarEn(1, "C");
BOF.eliminarInicio();
BOF.eliminarEn(0);`);
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
    } 
    else if (nuevaEstructura === 'Grafos') {
        // Código de ejemplo para grafos
        setCodigo(`Grafo BOF = new Grafo(false);
BOF.agregarNodo("A");
BOF.agregarNodo("B");
BOF.agregarNodo("C");
BOF.agregarNodo("D");
BOF.agregarNodo("E");
BOF.agregarArista("A", "B", 2);
BOF.agregarArista("A", "C", 3);
BOF.agregarArista("B", "D", 1);
BOF.agregarArista("C", "D", 4);
BOF.agregarArista("D", "E", 2);
BOF.bfs("A");
BOF.dfs("A");
BOF.dijkstra("A", "E");`);
    } else {
        setCodigo('');
    }
    
    // El consejo se mostrará automáticamente a través del useEffect
    // que escucha los cambios en estructuraSeleccionada
  };

  // Función para ejecutar código completo
const handleEjecutar = () => {
  if (!codigo.trim()) {
    if (mostrarConsejos && estructuraSeleccionada) {
      mostrarConsejoEducativo('codigo');
    } else {
      setMensajeEjecutor('Error: No hay código para ejecutar');
    }
    return;
  }
  
  if (!estructuraSeleccionada) {
    if (mostrarConsejos) {
      mostrarConsejo(
        '.selector-estructura',
        '🎯 Primero selecciona una estructura',
        'Elige qué estructura de datos quieres usar. Cada una tiene características únicas y casos de uso específicos.'
      );
    }
    setMensajeEjecutor('Error: Selecciona una estructura de datos');
    return;
  }
    try {
    // Reiniciar y cargar código para modo paso a paso
    interprete.reiniciar();
    interprete.cargarCodigo(codigo);
    
    // Ejecutar solo el primer paso
    const resultado = interprete.ejecutarSiguientePaso();
    
    if (resultado) {
      // Calcular línea actual si no está incluida
      if (!resultado.lineaActual) {
        resultado.lineaActual = calcularLineaActual(codigo, resultado.pasoActual);
      }
      
      setEstadoVisualizacion(resultado);
      setModoEjecucion('paso_a_paso');
      setMensajeEjecutor(`Paso ${resultado.pasoActual}/${resultado.totalPasos} ejecutado`);
      
      // Mostrar consejo sobre la ejecución
      if (mostrarConsejos) {
        mostrarConsejoEducativo('ejecucion', '.visualization-panel');
      }
    }
    
    console.log("Primer paso ejecutado:", resultado);
    
  } catch (error) {
    setMensajeEjecutor(`Error en la ejecución: ${error.message}`);
    console.error("Error al ejecutar código:", error);
    
    if (mostrarConsejos) {
      setTimeout(() => {
        mostrarConsejo(
          '.code-editor',
          '🐛 Error en el código',
          'Revisa la sintaxis: verifica paréntesis, comillas, y que las operaciones sean válidas para la estructura seleccionada.'
        );
      }, 1000);
    }
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
        '🔄 Reinicio completo',
        'Perfecto para experimentar con diferentes algoritmos. ¡El aprendizaje viene de la práctica constante!'
      );
    }
  };

  // Función para paso anterior - VERSIÓN ACTUALIZADA
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
        // Si el interpretador no devuelve lineaActual, calcularla
        if (!resultado.lineaActual) {
          resultado.lineaActual = calcularLineaActual(codigo, resultado.pasoActual);
        }
        
        setEstadoVisualizacion(resultado);
        setMensajeEjecutor(`Paso anterior ejecutado. Paso ${resultado.pasoActual}/${resultado.totalPasos}`);
        
        if (mostrarConsejos && resultado.pasoActual === 1) {
          setTimeout(() => {
            mostrarConsejo(
              '.button-group:last-of-type',
              '🔍 Navegando por los pasos',
              'Perfecto para revisar cada paso del algoritmo. La línea resaltada muestra qué se ejecutó.'
            );
          }, 500);
        }
      } else {
        setMensajeEjecutor('No hay pasos anteriores disponibles');
      }
      
    } catch (error) {
      setMensajeEjecutor(`Error en paso anterior: ${error.message}`);
    }
  };

  // Función para paso siguiente - VERSIÓN ACTUALIZADA
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
        // Si el interpretador no devuelve lineaActual, calcularla
        if (!resultado.lineaActual) {
          resultado.lineaActual = calcularLineaActual(codigo, resultado.pasoActual);
        }
        
        setEstadoVisualizacion(resultado);
        setMensajeEjecutor(`Paso ejecutado. Paso ${resultado.pasoActual}/${resultado.totalPasos}`);
        
        if (mostrarConsejos && resultado.pasoActual === 1) {
          setTimeout(() => {
           mostrarConsejo(
                  '.visualization-panel',
                  '🧠 Comprende la lógica',
                  'Observa cómo se transforma la estructura en cada paso. Todo cambio tiene una razón.'
                );

          }, 500);
        }
      } else {
        setMensajeEjecutor('No hay más pasos para ejecutar');
        
        if (mostrarConsejos) {
          setTimeout(() => {
            mostrarConsejo(
              '.info-panel',
              '🎉 Ejecución completada',
              '¡Excelente! Has visto todo el proceso paso a paso. Modifica el código y prueba de nuevo.'
            );
          }, 500);
        }
      }
      
    } catch (error) {
      setMensajeEjecutor(`Error en paso siguiente: ${error.message}`);
    }
  };

// Efecto para manejar atajos de teclado
useEffect(() => {
  const manejarTeclas = (event) => {
    // Solo procesar si no estamos escribiendo en un input/textarea
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }
    
    // Prevenir el comportamiento por defecto para nuestras teclas
    const teclasEspeciales = ['Enter', 'ArrowLeft', 'ArrowRight', 'F1'];
    if (teclasEspeciales.includes(event.key) || 
        (event.key.toLowerCase() === 'r' || event.key.toLowerCase() === 'c')) {
      event.preventDefault();
    }
 
    switch (event.key) {
      case 'Enter':
        // Enter para ejecutar
        handleEjecutar();
        break;
      case 'r':
      case 'R':
        // R para reiniciar
        handleReiniciar();
        break;
      case 'ArrowLeft':
        // Flecha izquierda para paso anterior
        handleAnterior();
        break;
      case 'ArrowRight':
        // Flecha derecha para paso siguiente
        handleSiguiente();
        break;
      case 'c':
      case 'C':
        // C para activar/desactivar consejos
        toggleConsejos();
        break;
    }
  };

  // Agregar el event listener
  document.addEventListener('keydown', manejarTeclas);
  
  // Cleanup: remover el event listener cuando el componente se desmonte
  return () => {
    document.removeEventListener('keydown', manejarTeclas);
  };
}, [codigo, estructuraSeleccionada, estadoVisualizacion, modoEjecucion,mostrarConsejos]);
  // Función para alternar el estado de los consejos
const toggleConsejos = () => {
  const nuevoEstado = !mostrarConsejos;
  setMostrarConsejos(nuevoEstado);
  
  if (nuevoEstado) {
    setTimeout(() => {
      mostrarConsejo(
        '.consejos-switch-container',
        '💡 ¡Consejos activados!',
        'Ahora recibirás tips educativos mientras trabajas. Estos consejos te ayudarán a entender mejor cada estructura de datos.'
      );
    }, 500);
  } else {
    // Feedback cuando se desactivan los consejos
    setMensajeEjecutor('💡 Consejos desactivados - Presiona F1 para reactivarlos');
    setTimeout(() => setMensajeEjecutor(''), 2000);
  }
};

  // Función para obtener la descripción del estado actual
  const obtenerDescripcion = () => {
    if (mensajeEjecutor) {
      return mensajeEjecutor;
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
   // Efecto para manejar atajos de teclado
  
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
                {mostrarConsejos ? 'Consejos educativos activados' : 'Consejos desactivados'}
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

          {/* Editor de código con indicador de paso actual */}
          <EditorCodigo
            valor={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            lineaActual={estadoVisualizacion?.lineaActual}
            modoEjecucion={modoEjecucion}
            pasoActual={estadoVisualizacion?.pasoActual || 0}
            totalPasos={estadoVisualizacion?.totalPasos || 0}
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
                {estadoVisualizacion.lineaActual && (
                  <>
                    <br />
                    Línea actual: {estadoVisualizacion.lineaActual}
                  </>
                )}
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
          estadoVisualizacion={estadoVisualizacion}
          estructuraSeleccionada={estructuraSeleccionada}
        />
        <BotonComentarios />
        </div>
      </div>
    </div>
  );
};

export default TutorVisual;