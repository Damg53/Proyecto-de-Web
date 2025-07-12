// components/EditorCodigo.jsx
// Importa React para crear el componente
import React from 'react'

// Componente funcional que renderiza un editor de código simple
// Recibe como props:
// - valor: el texto actual del editor (controlled component)
// - onChange: función callback que se ejecuta cuando cambia el contenido
const EditorCodigo = ({ valor, onChange }) => (
  // Contenedor del formulario usando clase Bootstrap
  <div className="form-group">
    {/* 
      Etiqueta descriptiva para el textarea
      - htmlFor: conecta la etiqueta con el textarea (accesibilidad)
      - text-white: clase Bootstrap para texto blanco
    */}
    <label htmlFor="codeInput" className="text-white">Ingresa tu código:</label>
    
    {/* 
      Textarea para escribir código
      - id: identificador único que coincide con htmlFor de la etiqueta
      - form-control: clase Bootstrap para estilo de formulario
      - code-editor: clase personalizada para estilos específicos del editor
      - rows: número de líneas visibles por defecto
      - placeholder: texto de ayuda que aparece cuando está vacío
      - value: valor controlado por React (viene del estado del componente padre)
      - onChange: función que se ejecuta cada vez que el usuario escribe
    */}
    <textarea
      id="codeInput"
      className="form-control code-editor"
      rows="10"
      placeholder="Ingrese el código"
      value={valor}
      onChange={onChange}
    ></textarea>
  </div>
)

// Exporta el componente como default para poder importarlo en otros archivos
export default EditorCodigo