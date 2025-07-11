// components/EditorCodigo.jsx
import React from 'react'

const EditorCodigo = ({ valor, onChange }) => (
  <div className="form-group">
    <label htmlFor="codeInput" className="text-white">Ingresa tu código:</label>
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

export default EditorCodigo
