import ColorPicker from '@/components/ColorPicker';
import SizePicker from '@/components/SizePicker';
import ProductSuggestions from './ProductSuggestions';
import type { Color, ColorId, Size } from '../useOnboardingHook';

interface OnboardingPickersProps {
  showButton: boolean;
  showBrandsPhase: boolean;
  showProductSuggestions: boolean;
  colors: Color[];
  sizes: Size[];
  selectedColor: ColorId;
  selectedSize: Size;
  colorPickerHighlighted: boolean;
  sizePickerHighlighted: boolean;
  orangeButtonPressed: boolean;
  blueButtonPressed: boolean;
  xlButtonPressed: boolean;
}

const OnboardingPickers = ({
  showButton,
  showBrandsPhase,
  showProductSuggestions,
  colors,
  sizes,
  selectedColor,
  selectedSize,
  colorPickerHighlighted,
  sizePickerHighlighted,
  orangeButtonPressed,
  blueButtonPressed,
  xlButtonPressed,
}: OnboardingPickersProps) => {
  if (!showButton || showBrandsPhase) return null;

  return (
    <>
      <ColorPicker
        colors={colors}
        selectedColor={selectedColor}
        highlighted={colorPickerHighlighted}
        orangeButtonPressed={orangeButtonPressed}
        blueButtonPressed={blueButtonPressed}
        visible={!showProductSuggestions}
      />
      <SizePicker
        sizes={sizes}
        selectedSize={selectedSize}
        highlighted={sizePickerHighlighted}
        xlButtonPressed={xlButtonPressed}
        visible={!showProductSuggestions}
      />
      {showProductSuggestions && <ProductSuggestions />}
    </>
  );
};

export default OnboardingPickers;
