import { useSplashScreenHook } from './useSplashScreenHook';
import SplashScreenView from './components/SplashScreenView';

const SplashScreen = () => {
  useSplashScreenHook();
  return <SplashScreenView />;
};

export default SplashScreen;
