import { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOnboardingHook } from './useOnboardingHook';
import OnboardingMainScreen from './components/OnboardingMainScreen';
import OnboardingPickers from './components/OnboardingPickers';
import OnboardingContinueButton from './components/OnboardingContinueButton';
import ScreenTransition from './components/ScreenTransition';
import AnimatedColumnsBackground from './components/AnimatedColumnsBackground';
import BrandsCard from './components/BrandsCard';

const Onboarding = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const props = useOnboardingHook();

  return (
    <>
      <AnimatePresence mode="wait">
        {!props.showBrandsPhase && (
          <OnboardingMainScreen
            ref={containerRef}
            showProductSuggestions={props.showProductSuggestions}
            currentJacket={props.currentJacket}
            isManualTransition={props.isManualTransition}
            isFirstCycle={props.isFirstCycle}
          />
        )}
        {props.showBrandsPhase && (
          <ScreenTransition show={props.showBrandsPhase}>
            <AnimatedColumnsBackground />
            <BrandsCard />
          </ScreenTransition>
        )}
      </AnimatePresence>
      <OnboardingPickers
        showButton={props.showButton}
        showBrandsPhase={props.showBrandsPhase}
        showProductSuggestions={props.showProductSuggestions}
        colors={props.colors}
        sizes={props.sizes}
        selectedColor={props.selectedColor}
        selectedSize={props.selectedSize}
        colorPickerHighlighted={props.colorPickerHighlighted}
        sizePickerHighlighted={props.sizePickerHighlighted}
        orangeButtonPressed={props.orangeButtonPressed}
        blueButtonPressed={props.blueButtonPressed}
        xlButtonPressed={props.xlButtonPressed}
      />
      <AnimatePresence>
        {props.showButton && !props.showBrandsPhase && (
          <OnboardingContinueButton
            visible
            onContinue={props.handleContinue}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Onboarding;
