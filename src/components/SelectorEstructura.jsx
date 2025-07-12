// components/SelectorEstructura.jsx
// Importa React para crear el componente
import React from 'react'

// Componente funcional que renderiza un selector dropdown para estructuras de datos
// Recibe como props:
// - estructuras: array con las estructuras disponibles ['Vector', 'Matriz', 'Pila', etc.]
// - valor: valor seleccionado actualmente (controlled component)
// - onChange: función callback que se ejecuta cuando cambia la selección
const SelectorEstructura = ({ estructuras, valor, onChange }) => (
  // Contenedor del formulario usando clase Bootstrap
  <div className="form-group">
    {/* 
      Etiqueta descriptiva para el select
      - htmlFor: conecta la etiqueta con el select (accesibilidad)
      - text-white: clase Bootstrap para texto blanco
    */}
    <label htmlFor="structureType" className="text-white">Selecciona una estructura:</label>
    
    {/* 
      Select dropdown para elegir la estructura de datos
      - id: identificador único que coincide con htmlFor de la etiqueta
      - form-control: clase Bootstrap para estilo de formulario
      - value: valor controlado por React (viene del estado del componente padre)
      - onChange: función que se ejecuta cuando el usuario selecciona una opción
    */}
    <select
      id="structureType"
      className="form-control"
      value={valor}
      onChange={onChange}
    >
      {/* Opción por defecto que indica al usuario qué hacer */}
      <option value="">Selecciona...</option>
      
      {/* 
        Mapeo del array de estructuras para crear las opciones dinámicamente
        - map: recorre cada estructura del array
        - key: identificador único requerido por React para listas
        - value: valor que se enviará cuando se seleccione esta opción
        - {estructura}: texto que se mostrará al usuario
      */}
      {estructuras.map((estructura, index) => (
        <option key={index} value={estructura}>{estructura}</option>
      ))}
    </select>
  </div>
)

// Exporta el componente como default para poder importarlo en otros archivos
export default SelectorEstructura