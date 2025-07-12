import React from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Eye, 
  Code, 
  Zap,
  ArrowRight,
  Brain
} from 'lucide-react'
import "./Home.css"

// Componente para el icono del header
const HeaderIcon = () => (
  <div className="header-icon">
    <div className="icon-container">
      <BookOpen className="icon" size={32} />
    </div>
  </div>
)

// Componente para el título principal
const MainTitle = () => (
  <div className="title-section">
    <h1 className="main-title">
      ¡Bienvenido al Tutor Visual!
    </h1>
    <p className="subtitle">
      Aprende estructuras de datos como nunca antes
    </p>
  </div>
)

// Componente para las características
const FeatureCard = ({ icon: Icon, title, description, variant = "" }) => (
  <div className={`feature-card ${variant}`}>
    <Icon className={`feature-icon ${variant}`} size={24} />
    <h3 className={`feature-title ${variant}`}>{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
)

// Componente para la descripción principal
const AboutSection = () => (
  <div className="card">
    <h2 className="card-title">¿Qué es el Tutor Visual?</h2>
    <p className="card-description">
      Es una herramienta educativa <strong>interactiva</strong> que transforma conceptos abstractos 
      de programación en <strong>experiencias visuales</strong> fáciles de entender. 
      Cada estructura de datos cobra vida a través de <strong>animaciones</strong> y 
      <strong>simulaciones en tiempo real</strong>.
    </p>
    
    <div className="features-grid">
      <FeatureCard
        icon={Eye}
        title="Visualización Interactiva"
        description="Ve cómo cambian las estructuras con cada operación"
      />
      <FeatureCard
        icon={Code}
        title="Ejemplos Prácticos"
        description="Código real junto a las visualizaciones"
        variant="purple"
      />
    </div>
  </div>
)

// Componente para un elemento de estructura
const StructureItem = ({ emoji, name, description }) => (
  <div className="structure-item">
    <span className="structure-emoji">{emoji}</span>
    <h3 className="structure-name">{name}</h3>
    <p className="structure-desc">{description}</p>
  </div>
)

// Componente para las estructuras de datos
const StructuresSection = () => {
  const structures = [
    { emoji: "📊", name: "Vectores", description: "Arreglos dinámicos" },
    { emoji: "🔢", name: "Matrices", description: "Datos en 2D" },
    { emoji: "📋", name: "Listas", description: "Listas enlazadas" },
    { emoji: "📚", name: "Pilas", description: "Estructura LIFO" },
    { emoji: "🚶", name: "Colas", description: "Estructura FIFO" },
    { emoji: "🌳", name: "Árboles", description: "Datos jerárquicos" },
    { emoji: "🕸️", name: "Grafos", description: "Conexiones complejas" }
  ]

  return (
    <div className="structures-card">
      <h2 className="structures-title">¿Qué estructuras aprenderás?</h2>
      <div className="structures-grid">
        {structures.map((structure, index) => (
          <StructureItem
            key={index}
            emoji={structure.emoji}
            name={structure.name}
            description={structure.description}
          />
        ))}
      </div>
    </div>
  )
}

// Componente para un paso del proceso
const ProcessStep = ({ number, title, description, color }) => (
  <div className="process-step">
    <div className={`step-number ${color}`}>
      <span>{number}</span>
    </div>
    <h3 className={`step-title ${color}`}>{title}</h3>
    <p className="step-description">{description}</p>
  </div>
)

// Componente para el proceso
const ProcessSection = () => {
  const steps = [
    { number: 1, title: "Selecciona", description: "Elige la estructura que quieres aprender", color: "blue" },
    { number: 2, title: "Interactúa", description: "Agrega, elimina y modifica elementos", color: "purple" },
    { number: 3, title: "Aprende", description: "Observa y comprende visualmente", color: "pink" }
  ]

  return (
    <div className="process-card">
      <h2 className="process-title">¿Cómo funciona?</h2>
      <div className="process-grid">
        {steps.map((step, index) => (
          <ProcessStep
            key={index}
            number={step.number}
            title={step.title}
            description={step.description}
            color={step.color}
          />
        ))}
      </div>
    </div>
  )
}

// Componente para el Call to Action
const CallToAction = () => (
  <div className="cta-section">
    <p className="cta-text">
      ¿Estás listo para <strong>transformar</strong> tu manera de aprender programación?
    </p>
    
    <Link to="/tutor" className="cta-button">
      <Brain size={28} />
      Comenzar Ahora
      <ArrowRight className="arrow" size={20} />
    </Link>
    
    <div className="cta-info">
      <Zap className="cta-info-icon" size={16} />
      <span>100% gratis • Sin registro necesario</span>
    </div>
  </div>
)

// Componente para los elementos de fondo
const BackgroundElements = () => (
  <div className="bg-elements">
    <div className="bg-circle-1"></div>
    <div className="bg-circle-2"></div>
    <div className="bg-circle-3"></div>
  </div>
)

// Componente principal
const Home = () => {
  return (
    <div className="container">
      <BackgroundElements />
      
      <div className="main-content">
        <div className="content-wrapper">
          <HeaderIcon />
          <MainTitle />
          <AboutSection />
          <StructuresSection />
          <ProcessSection />
          <CallToAction />
        </div>
      </div>
    </div>
  )
}

export default Home