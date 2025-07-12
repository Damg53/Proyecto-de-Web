// Importa React y el hook useState para manejar el estado del componente
import React, { useState } from 'react'

// Importa los componentes personalizados que conforman la interfaz
import SelectorEstructura from '../components/SelectorEstructura'  // Selector para elegir tipo de estructura
import EditorCodigo from '../components/EditorCodigo'              // Editor donde se escribe el código
import BotonesAccion from '../components/BotonesAccion'            // Botones de control (ejecutar, reiniciar, etc.)
import CanvasVisual from '../components/CanvasVisual'              // Canvas para visualización gráfica
import PanelInformacion from '../components/PanelInformacion'      // Panel que muestra información contextual

// Importa los estilos CSS específicos para este componente
import './tutor.css'

// Define un array constante con las estructuras de datos disponibles
const estructuras = ['Vector', 'Matriz', 'Pila', 'Cola', 'Lista', 'Arboles', 'Grafos']

// Componente principal del tutor visual
const TutorVisual = () => {
  // Estado para almacenar la estructura de datos seleccionada
  const [estructuraSeleccionada, setEstructuraSeleccionada] = useState('')
  
  // Estado para almacenar el código escrito por el usuario
  const [codigo, setCodigo] = useState('')

  return (
    // Contenedor principal usando Bootstrap para layout responsive
    <div className="container-fluid tutor-container">
      <div className="row">
        
        {/* Panel de control izquierdo (25% del ancho) */}
        <div className="col-md-3 control-panel">
          <h3 className="text-white">Tutor de Estructuras de Datos</h3>

          {/* Selector para elegir la estructura de datos */}
          <SelectorEstructura
            estructuras={estructuras}
            valor={estructuraSeleccionada}
            onChange={(e) => setEstructuraSeleccionada(e.target.value)}
          />

          {/* Editor de código donde el usuario escribe */}
          <EditorCodigo
            valor={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />

          {/* Botones de acción para controlar la ejecución */}
          <BotonesAccion
            onEjecutar={() => console.log("Ejecutar")}      // Ejecuta el código
            onReiniciar={() => console.log("Reiniciar")}    // Reinicia la visualización
            onAnterior={() => console.log("Anterior")}      // Paso anterior en la ejecución
            onSiguiente={() => console.log("Siguiente")}    // Paso siguiente en la ejecución
          />
        </div>

        {/* Panel de visualización derecho (75% del ancho) */}
        <div className="col-md-9 visualization-panel">
          {/* Canvas para mostrar la visualización gráfica (comentado por ahora) */}
          {/*<CanvasVisual />*/}
          
          {/* Panel que muestra información sobre la línea de código actual */}
          <PanelInformacion descripcion="Aquí aparecerá lo que pase en la respectiva línea de código." />
        </div>
      </div>
    </div>
  )
}

// Exporta el componente como default para poder importarlo en otros archivos
export default TutorVisual