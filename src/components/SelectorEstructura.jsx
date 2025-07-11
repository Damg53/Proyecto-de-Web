
import React from 'react'

const SelectorEstructura = ({ estructuras, valor, onChange }) => (
  <div className="form-group">
    <label htmlFor="structureType" className="text-white">Selecciona una estructura:</label>
    <select
      id="structureType"
      className="form-control"
      value={valor}
      onChange={onChange}
    >
      <option value="">Selecciona...</option>
      {estructuras.map((estructura, index) => (
        <option key={index} value={estructura}>{estructura}</option>
      ))}
    </select>
  </div>
)

export default SelectorEstructura
