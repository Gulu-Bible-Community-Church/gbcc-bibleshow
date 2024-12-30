import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainScreen from './pages/main'
import SecondaryScreen from './pages/secondary'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/secondary" element={<SecondaryScreen />} />
      </Routes>
    </>
  )
}

export default App
