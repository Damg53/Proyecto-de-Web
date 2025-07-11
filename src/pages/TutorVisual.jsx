import React, { useState } from 'react'
import SelectorEstructura from '../components/SelectorEstructura'
import EditorCodigo from '../components/EditorCodigo'
import BotonesAccion from '../components/BotonesAccion'
import CanvasVisual from '../components/CanvasVisual'
import PanelInformacion from '../components/PanelInformacion'
import './tutor.css'


const estructuras = ['Vector', 'Matriz', 'Pila', 'Cola', 'Lista', 'Arboles', 'Grafos']

const TutorVisual = () => {
  const [estructuraSeleccionada, setEstructuraSeleccionada] = useState('')
  const [codigo, setCodigo] = useState('')

  return (
    <div className="container-fluid tutor-container">
      <div className="row">
        <div className="col-md-3 control-panel">
          <h3 className="text-white">Tutor de Estructuras de Datos</h3>

          <SelectorEstructura
            estructuras={estructuras}
            valor={estructuraSeleccionada}
            onChange={(e) => setEstructuraSeleccionada(e.target.value)}
          />

          <EditorCodigo
            valor={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />

          <BotonesAccion
            onEjecutar={() => console.log("Ejecutar")}
            onReiniciar={() => console.log("Reiniciar")}
            onAnterior={() => console.log("Anterior")}
            onSiguiente={() => console.log("Siguiente")}
          />
        </div>

        <div className="col-md-9 visualization-panel">
          {/*<CanvasVisual />*/}
          <PanelInformacion descripcion="Aquí aparecerá lo que pase en la respectiva línea de código." />
        </div>
      </div>
    </div>
  )
}

export default TutorVisual
