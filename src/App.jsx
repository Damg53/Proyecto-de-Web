import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TutorVisual from './pages/TutorVisual'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tutor" element={<TutorVisual />} />
    </Routes>
  )
}

export default App
