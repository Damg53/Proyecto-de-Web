import React from 'react'
import { Link } from 'react-router-dom'
import "./Home.css"
const Home = () => {
  return (
    <div className="container">
      {/* Elementos de fondo animados */}
      <div className="bg-elements">
        <div className="bg-circle-1"></div>
        <div className="bg-circle-2"></div>
        <div className="bg-circle-3"></div>
      </div>

      <div className="main-content">
        <div className="content-wrapper">
          {/* Header con icono */}
          <div className="header-icon">
            <div className="icon-container">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          
          <h1 className="main-title">
            ¡Bienvenido al Tutor Visual!
          </h1>
          
          <p className="subtitle">
            Aprende estructuras de datos como nunca antes
          </p>

          {/* Descripción principal */}
          <div className="card">
            <h2 className="card-title">¿Qué es el Tutor Visual?</h2>
            <p className="card-description">
              Es una herramienta educativa <strong>interactiva</strong> que transforma conceptos abstractos 
              de programación en <strong>experiencias visuales</strong> fáciles de entender. 
              Cada estructura de datos cobra vida a través de <strong>animaciones</strong> y 
              <strong>simulaciones en tiempo real</strong>.
            </p>
            
            <div className="features-grid">
              <div className="feature-card">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h3 className="feature-title">Visualización Interactiva</h3>
                <p className="feature-description">Ve cómo cambian las estructuras con cada operación</p>
              </div>
              <div className="feature-card purple">
                <svg className="feature-icon purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h3 className="feature-title purple">Ejemplos Prácticos</h3>
                <p className="feature-description">Código real junto a las visualizaciones</p>
              </div>
            </div>
          </div>

          {/* Vista previa de estructuras de datos */}
          <div className="structures-card">
            <h2 className="structures-title">¿Qué estructuras aprenderás?</h2>
            <div className="structures-grid">
              <div className="structure-item">
                <span className="structure-emoji">📊</span>
                <h3 className="structure-name">Vectores</h3>
                <p className="structure-desc">Arreglos dinámicos</p>
              </div>
              <div className="structure-item">
                <span className="structure-emoji">🔢</span>
                <h3 className="structure-name">Matrices</h3>
                <p className="structure-desc">Datos en 2D</p>
              </div>
              <div className="structure-item">
                <span className="structure-emoji">📋</span>
                <h3 className="structure-name">Listas</h3>
                <p className="structure-desc">Listas enlazadas</p>
              </div>
              <div className="structure-item">
                <span className="structure-emoji">📚</span>
                <h3 className="structure-name">Pilas</h3>
                <p className="structure-desc">Estructura LIFO</p>
              </div>
              <div className="structure-item">
                <span className="structure-emoji">🚶</span>
                <h3 className="structure-name">Colas</h3>
                <p className="structure-desc">Estructura FIFO</p>
              </div>
              <div className="structure-item">
                <span className="structure-emoji">🌳</span>
                <h3 className="structure-name">Árboles</h3>
                <p className="structure-desc">Datos jerárquicos</p>
              </div>
              <div className="structure-item">
                <span className="structure-emoji">🕸️</span>
                <h3 className="structure-name">Grafos</h3>
                <p className="structure-desc">Conexiones complejas</p>
              </div>
            </div>
          </div>

          {/* Cómo funciona */}
          <div className="process-card">
            <h2 className="process-title">¿Cómo funciona?</h2>
            <div className="process-grid">
              <div className="process-step">
                <div className="step-number blue">
                  <span>1</span>
                </div>
                <h3 className="step-title blue">Selecciona</h3>
                <p className="step-description">Elige la estructura que quieres aprender</p>
              </div>
              <div className="process-step">
                <div className="step-number purple">
                  <span>2</span>
                </div>
                <h3 className="step-title purple">Interactúa</h3>
                <p className="step-description">Agrega, elimina y modifica elementos</p>
              </div>
              <div className="process-step">
                <div className="step-number pink">
                  <span>3</span>
                </div>
                <h3 className="step-title pink">Aprende</h3>
                <p className="step-description">Observa y comprende visualmente</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="cta-section">
            <p className="cta-text">
              ¿Estás listo para <strong>transformar</strong> tu manera de aprender programación?
            </p>
            
            <Link to="/tutor" className="cta-button">
              Comenzar Ahora
              <svg className="arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <div className="cta-info">
              <svg className="cta-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>100% gratis • Sin registro necesario</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home