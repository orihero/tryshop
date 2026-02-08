import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SPLASH_SCREEN_DURATION = 2000; // 1.5s animation + 0.5s delay

export const useSplashScreenHook = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to onboarding after animation completes
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, SPLASH_SCREEN_DURATION);

    return () => clearTimeout(timer);
  }, [navigate]);

  return {};
};
