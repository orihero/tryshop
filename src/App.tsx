import { Routes, Route } from 'react-router-dom'
import { TranslationProvider } from '@/contexts/TranslationContext'
import SplashScreen from '@/components/SplashScreen'
import Onboarding from '@/components/Onboarding'

function App() {
  return (
    <TranslationProvider>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </TranslationProvider>
  )
}

export default App
