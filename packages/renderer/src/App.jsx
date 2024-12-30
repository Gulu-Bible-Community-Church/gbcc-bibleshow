import { Route, Routes } from 'react-router-dom'
import MainScreen from './pages/main'
import SecondaryScreen from './pages/secondary'

function App() {

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
