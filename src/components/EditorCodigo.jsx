import React, { useRef, useEffect, useState } from 'react';

const EditorCodigo = ({ 
  valor, 
  onChange, 
  lineaActual = null, 
  modoEjecucion = null,
  pasoActual = 0,
  totalPasos = 0 
}) => {
  const textareaRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(20);

  // Calcular altura de línea real
  useEffect(() => {
    if (textareaRef.current) {
      const computedStyle = window.getComputedStyle(textareaRef.current);
      const calculatedLineHeight = parseInt(computedStyle.lineHeight);
      if (!isNaN(calculatedLineHeight)) {
        setLineHeight(calculatedLineHeight);
      }
    }
  }, []);

  // Scroll automático a la línea actual
  useEffect(() => {
    if (lineaActual && textareaRef.current && modoEjecucion === 'paso_a_paso') {
      const textarea = textareaRef.current;
      const scrollPosition = (lineaActual - 1) * lineHeight;
      textarea.scrollTop = Math.max(0, scrollPosition - textarea.clientHeight / 3);
    }
  }, [lineaActual, lineHeight, modoEjecucion]);

  const lineas = valor.split('\n');
  const numLineas = lineas.length;

  return (
    <div className="editor-container">
      {/* Header del editor */}
      <div className="editor-header">
        <label className="editor-label">
          Ingresa tu código:
        </label>
        
        {modoEjecucion === 'paso_a_paso' && (
          <div className="status-badge">
            <span className="step-indicator">
              📍 Paso {pasoActual}/{totalPasos}
              {lineaActual && ` - Línea ${lineaActual}`}
            </span>
          </div>
        )}
      </div>

      {/* Contenedor principal del editor */}
      <div className="code-container">
        {/* Numeración de líneas */}
        <div className="line-numbers">
          {lineas.map((_, index) => {
            const numeroLinea = index + 1;
            const esLineaActual = lineaActual === numeroLinea && modoEjecucion === 'paso_a_paso';
            
            return (
              <div 
                key={index}
                className={`line-number ${esLineaActual ? 'active' : ''}`}
                style={{ height: `${lineHeight}px` }}
              >
                {esLineaActual && <span className="arrow">▶</span>}
                <span className="number">{numeroLinea}</span>
              </div>
            );
          })}
        </div>

        {/* Textarea del código */}
        <div className="editor-wrapper">
          <textarea
            ref={textareaRef}
            className={`code-editor ${modoEjecucion === 'paso_a_paso' ? 'debug-mode' : ''}`}
            value={valor}
            onChange={onChange}
            placeholder="Escribe tu código aquí..."
            spellCheck={false}
            rows={Math.max(10, numLineas + 2)}
          />
          
          {/* Indicador flotante */}
          {lineaActual && modoEjecucion === 'paso_a_paso' && (
            <div className="floating-indicator">
              <div className="indicator-content">
                <span className="indicator-icon">🎯</span>
                <span>Ejecutando línea {lineaActual}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ayuda contextual */}
      <div className="editor-help">
        {modoEjecucion === 'paso_a_paso' ? (
          <span>▶ indica la línea que se está ejecutando actualmente</span>
        ) : (
          <span>Usa los controles para ejecutar tu código paso a paso</span>
        )}
      </div>

      <style jsx>{`
        .editor-container {
          width: 100%;
          margin-bottom: 20px;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding: 0 5px;
        }

        .editor-label {
          color: #e9ecef;
          font-weight: 500;
          margin: 0;
        }

        .status-badge {
          display: flex;
          align-items: center;
        }

        .step-indicator {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.8em;
          font-weight: 600;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }

        .code-container {
          display: flex;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          background: #1e1e1e;
        }

        .line-numbers {
          background: #2d2d30;
          border-right: 2px solid #404040;
          padding: 8px 0;
          min-width: 50px;
          user-select: none;
          font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
          font-size: 13px;
        }

        .line-number {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 8px;
          position: relative;
          color: #858585;
          transition: all 0.2s ease;
        }

        .line-number.active {
          background: linear-gradient(90deg, #0066cc, #0080ff);
          color: white;
          font-weight: bold;
        }

        .arrow {
          position: absolute;
          right: -15px;
          color: #ffd700;
          font-size: 12px;
          animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.4; }
        }

        .number {
          font-size: 12px;
        }

        .editor-wrapper {
          flex: 1;
          position: relative;
        }

        .code-editor {
          width: 100%;
          background: #1e1e1e;
          color: #d4d4d4;
          border: none;
          outline: none;
          font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
          font-size: 14px;
          line-height: 20px;
          padding: 8px 12px;
          resize: vertical;
          min-height: 200px;
        }

        .code-editor.debug-mode {
          background: #252526;
          border-left: 3px solid #007acc;
        }

        .code-editor::placeholder {
          color: #6a6a6a;
          font-style: italic;
        }

        .floating-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          pointer-events: none;
          z-index: 100;
        }

        .indicator-content {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          animation: slideInBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes slideInBounce {
          0% {
            opacity: 0;
            transform: translateX(30px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .indicator-icon {
          font-size: 14px;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
          60% { transform: translateY(-2px); }
        }

        .editor-help {
          margin-top: 8px;
          text-align: center;
          padding: 0 5px;
        }

        .editor-help span {
          color: #6c757d;
          font-size: 0.85em;
          font-style: italic;
        }

        /* Scrollbar personalizado */
        .code-editor::-webkit-scrollbar {
          width: 8px;
        }

        .code-editor::-webkit-scrollbar-track {
          background: #2d2d30;
        }

        .code-editor::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 4px;
        }

        .code-editor::-webkit-scrollbar-thumb:hover {
          background: #777;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .editor-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .line-numbers {
            min-width: 40px;
          }
          
          .code-editor {
            font-size: 13px;
          }
          
          .floating-indicator {
            position: relative;
            top: 0;
            right: 0;
            margin: 8px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default EditorCodigo;