import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useFontByLanguage } from '@/hooks/useFontByLanguage'
import { useAuthStore } from '@/stores/authStore'
import SplashScreen from '@/pages/SplashScreen/SplashScreen'
import Onboarding from '@/pages/Onboarding/Onboarding'
import Home from '@/pages/Home/Home'
import ProductDetails from '@/pages/ProductDetails/ProductDetails'
import TryOn from '@/pages/TryOn/TryOn'
import SignIn from '@/pages/SignIn/SignIn'
import SignUp from '@/pages/SignUp/SignUp'
import Profile from '@/pages/Profile/Profile'
import Cart from '@/pages/Cart/Cart'
import MainTabLayout from '@/pages/MainTabLayout'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void
        expand: () => void
      }
    }
  }
}

function App() {
  useFontByLanguage();

  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<MainTabLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/try-on/:id" element={<TryOn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

export default App
