import { Routes, Route } from 'react-router-dom'
import SplashScreen from '@/components/SplashScreen'
import Onboarding from '@/components/Onboarding'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  )
}

export default App
