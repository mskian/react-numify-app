import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Numify from './pages/Numify.jsx'
import Home from './pages/Home.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/numify" element={<Numify />} />
      </Routes>
    </Router>
  )
}

export default App
