import { useState, useEffect, useCallback } from 'react';

// Animation timing constants - single source of truth
const ANIMATION_TIMINGS = {
  ZOOM_DELAY: 0.3,
  ZOOM_DURATION: 0.5,
  BUTTON_SHOW_DELAY: 800, // 300ms delay + ~500ms animation duration
  JACKET1_DELAY_FIRST: 0.8,
  JACKET1_DURATION: 0.6,
  JACKET1_STAY_TIME: 0.7,
  JACKET2_DELAY: 0.7, // Delay after scale up (0.4s) + button press (0.3s)
  JACKET2_DURATION: 0.6,
  JACKET2_STAY_TIME: 0.7,
  JACKET3_DELAY: 0.7,
  JACKET3_DURATION: 0.6,
  JACKET3_STAY_TIME: 0.7,
  COLOR_PICKER_SCALE_UP_DURATION: 0.4,
  BUTTON_PRESS_DURATION: 0.3,
  COLOR_PICKER_SCALE_DOWN_DELAY: 0.1,
} as const;

// Calculate derived timings
const FIRST_CYCLE_JACKET1_TRIGGER = 
  ANIMATION_TIMINGS.JACKET1_DELAY_FIRST + 
  ANIMATION_TIMINGS.JACKET1_DURATION + 
  ANIMATION_TIMINGS.JACKET1_STAY_TIME; // 2.1s

const LOOP_JACKET1_TRIGGER = 
  ANIMATION_TIMINGS.JACKET1_DURATION + 
  ANIMATION_TIMINGS.JACKET1_STAY_TIME; // 1.3s

const JACKET2_TRIGGER = 
  FIRST_CYCLE_JACKET1_TRIGGER + 
  ANIMATION_TIMINGS.COLOR_PICKER_SCALE_UP_DURATION + 
  ANIMATION_TIMINGS.BUTTON_PRESS_DURATION + 
  ANIMATION_TIMINGS.JACKET2_STAY_TIME; // 4.8s

const JACKET3_TRIGGER = 
  JACKET2_TRIGGER + 
  ANIMATION_TIMINGS.COLOR_PICKER_SCALE_UP_DURATION + 
  ANIMATION_TIMINGS.BUTTON_PRESS_DURATION + 
  ANIMATION_TIMINGS.JACKET3_STAY_TIME; // 7.5s

export type ColorId = 'blue' | 'orange' | 'black';
export type Size = 'S' | 'M' | 'L' | 'XL';
export type JacketNumber = 1 | 2 | 3;

export interface Color {
  id: ColorId;
  value: string;
}

const ONBOARDING_COLORS: Color[] = [
  { id: 'blue', value: '#3B82F6' },
  { id: 'orange', value: '#F97316' },
  { id: 'black', value: '#000000' },
];

const ONBOARDING_SIZES: Size[] = ['S', 'M', 'L', 'XL'];

export const useOnboardingHook = () => {
  const [showButton, setShowButton] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ColorId>('blue');
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [currentJacket, setCurrentJacket] = useState<JacketNumber>(1);
  const [isManualTransition, setIsManualTransition] = useState(false);
  const [isFirstCycle, setIsFirstCycle] = useState(true);
  const [colorPickerHighlighted, setColorPickerHighlighted] = useState(false);
  const [sizePickerHighlighted, setSizePickerHighlighted] = useState(false);
  const [orangeButtonPressed, setOrangeButtonPressed] = useState(false);
  const [blueButtonPressed, setBlueButtonPressed] = useState(false);
  const [xlButtonPressed, setXlButtonPressed] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [showBrandsPhase, setShowBrandsPhase] = useState(false);

  // Show button after zoom animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, ANIMATION_TIMINGS.BUTTON_SHOW_DELAY);

    return () => clearTimeout(timer);
  }, []);

  // Handle jacket1 automatic transition to jacket2
  useEffect(() => {
    if (currentJacket !== 1 || isManualTransition || showProductSuggestions) return;
    
    const delay = isFirstCycle ? FIRST_CYCLE_JACKET1_TRIGGER * 1000 : LOOP_JACKET1_TRIGGER * 1000;
    
    const timer = setTimeout(() => {
      // Step 1: Scale up color picker
      setColorPickerHighlighted(true);
      // Step 2: After scale up animation, press orange button
      setTimeout(() => {
        setOrangeButtonPressed(true);
        // Step 3: After button press animation, change color and jacket
        setTimeout(() => {
          setSelectedColor('orange');
          setCurrentJacket(2);
          setIsFirstCycle(false);
          // Step 4: Scale down color picker after jacket change starts
          setTimeout(() => {
            setColorPickerHighlighted(false);
          }, ANIMATION_TIMINGS.COLOR_PICKER_SCALE_DOWN_DELAY * 1000);
        }, ANIMATION_TIMINGS.BUTTON_PRESS_DURATION * 1000);
      }, ANIMATION_TIMINGS.COLOR_PICKER_SCALE_UP_DURATION * 1000);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentJacket, isManualTransition, isFirstCycle, showProductSuggestions]);

  // Handle jacket2 automatic transition to jacket3
  useEffect(() => {
    if (currentJacket !== 2 || isManualTransition || showProductSuggestions) return;
    
    const timer = setTimeout(() => {
      // Step 1: Scale up size picker and color picker (for blue)
      setSizePickerHighlighted(true);
      setColorPickerHighlighted(true);
      // Step 2: After scale up animation, press XL and blue buttons
      setTimeout(() => {
        setXlButtonPressed(true);
        setBlueButtonPressed(true);
        // Step 3: After button press animation, change size, color, and jacket
        setTimeout(() => {
          setSelectedSize('XL');
          setSelectedColor('blue');
          setCurrentJacket(3);
          // Step 4: Scale down pickers after jacket change starts
          setTimeout(() => {
            setSizePickerHighlighted(false);
            setColorPickerHighlighted(false);
          }, ANIMATION_TIMINGS.COLOR_PICKER_SCALE_DOWN_DELAY * 1000);
        }, ANIMATION_TIMINGS.BUTTON_PRESS_DURATION * 1000);
      }, ANIMATION_TIMINGS.COLOR_PICKER_SCALE_UP_DURATION * 1000);
    }, JACKET2_TRIGGER * 1000);

    return () => clearTimeout(timer);
  }, [currentJacket, isManualTransition, showProductSuggestions]);

  // Loop animation: After jacket3 appears and stays, loop back to jacket1
  useEffect(() => {
    if (!(currentJacket === 3 && !isManualTransition && !showProductSuggestions)) {
      return () => {}; // Always return a cleanup function
    }

    const timer = setTimeout(() => {
      // Reset all button states
      setOrangeButtonPressed(false);
      setBlueButtonPressed(false);
      setXlButtonPressed(false);
      
      // Reset manual transition flag for the loop
      setIsManualTransition(false);
      
      // Loop back to jacket1: blue color, M size
      setSelectedColor('blue');
      setSelectedSize('M');
      setCurrentJacket(1);
    }, JACKET3_TRIGGER * 1000);

    return () => clearTimeout(timer);
  }, [currentJacket, isManualTransition, showProductSuggestions]);

  const handleContinue = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    // If product suggestions are not shown yet, show them and stop animations
    if (!showProductSuggestions) {
      // Stop all automatic animations
      setIsManualTransition(true);
      setShowProductSuggestions(true);
      
      // If currently on jacket 3, randomly pick jacket 1 or 2
      if (currentJacket === 3) {
        const randomJacket = Math.random() < 0.5 ? 1 : 2;
        
        if (randomJacket === 1) {
          setSelectedColor('blue');
          setSelectedSize('M');
          setCurrentJacket(1);
        } else {
          setSelectedColor('orange');
          setSelectedSize('M');
          setCurrentJacket(2);
        }
      } else {
        // If on jacket 1 or 2, randomly pick between 1 or 2
        const randomJacket = Math.random() < 0.5 ? 1 : 2;
        
        if (randomJacket === 1) {
          setSelectedColor('blue');
          setSelectedSize('M');
          setCurrentJacket(1);
        } else {
          setSelectedColor('orange');
          setSelectedSize('M');
          setCurrentJacket(2);
        }
      }
      
      return;
    }
    
    // If product suggestions are shown but brands phase is not, show brands phase (3rd press)
    if (showProductSuggestions && !showBrandsPhase) {
      setShowBrandsPhase(true);
      return;
    }
    
    console.log('Continue clicked');
  }, [currentJacket, showProductSuggestions, showBrandsPhase]);

  return {
    showButton,
    selectedColor,
    selectedSize,
    currentJacket,
    isManualTransition,
    isFirstCycle,
    colorPickerHighlighted,
    sizePickerHighlighted,
    orangeButtonPressed,
    blueButtonPressed,
    xlButtonPressed,
    showProductSuggestions,
    showBrandsPhase,
    handleContinue,
    colors: ONBOARDING_COLORS,
    sizes: ONBOARDING_SIZES,
    animationTimings: ANIMATION_TIMINGS,
  };
};
