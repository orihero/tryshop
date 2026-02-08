import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronDown, IoSearch, IoClose } from 'react-icons/io5';

export interface Country {
  name: string;
  iso: string;
  dialCode: string;
}

/** Render a country flag as an image via flagcdn.com (works on all platforms including Windows). */
const CountryFlag = ({ iso, size = 20 }: { iso: string; size?: number }) => (
  <img
    src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
    srcSet={`https://flagcdn.com/w80/${iso.toLowerCase()}.png 2x`}
    alt={iso}
    width={size}
    height={Math.round(size * 0.75)}
    className="rounded-sm object-cover"
    style={{ minWidth: size }}
  />
);

const COUNTRIES: Country[] = [
  { name: 'Afghanistan', iso: 'AF', dialCode: '+93' },
  { name: 'Albania', iso: 'AL', dialCode: '+355' },
  { name: 'Algeria', iso: 'DZ', dialCode: '+213' },
  { name: 'Andorra', iso: 'AD', dialCode: '+376' },
  { name: 'Angola', iso: 'AO', dialCode: '+244' },
  { name: 'Argentina', iso: 'AR', dialCode: '+54' },
  { name: 'Armenia', iso: 'AM', dialCode: '+374' },
  { name: 'Australia', iso: 'AU', dialCode: '+61' },
  { name: 'Austria', iso: 'AT', dialCode: '+43' },
  { name: 'Azerbaijan', iso: 'AZ', dialCode: '+994' },
  { name: 'Bahrain', iso: 'BH', dialCode: '+973' },
  { name: 'Bangladesh', iso: 'BD', dialCode: '+880' },
  { name: 'Belarus', iso: 'BY', dialCode: '+375' },
  { name: 'Belgium', iso: 'BE', dialCode: '+32' },
  { name: 'Belize', iso: 'BZ', dialCode: '+501' },
  { name: 'Benin', iso: 'BJ', dialCode: '+229' },
  { name: 'Bhutan', iso: 'BT', dialCode: '+975' },
  { name: 'Bolivia', iso: 'BO', dialCode: '+591' },
  { name: 'Bosnia and Herzegovina', iso: 'BA', dialCode: '+387' },
  { name: 'Botswana', iso: 'BW', dialCode: '+267' },
  { name: 'Brazil', iso: 'BR', dialCode: '+55' },
  { name: 'Brunei', iso: 'BN', dialCode: '+673' },
  { name: 'Bulgaria', iso: 'BG', dialCode: '+359' },
  { name: 'Burkina Faso', iso: 'BF', dialCode: '+226' },
  { name: 'Burundi', iso: 'BI', dialCode: '+257' },
  { name: 'Cambodia', iso: 'KH', dialCode: '+855' },
  { name: 'Cameroon', iso: 'CM', dialCode: '+237' },
  { name: 'Canada', iso: 'CA', dialCode: '+1' },
  { name: 'Chad', iso: 'TD', dialCode: '+235' },
  { name: 'Chile', iso: 'CL', dialCode: '+56' },
  { name: 'China', iso: 'CN', dialCode: '+86' },
  { name: 'Colombia', iso: 'CO', dialCode: '+57' },
  { name: 'Congo', iso: 'CG', dialCode: '+242' },
  { name: 'Costa Rica', iso: 'CR', dialCode: '+506' },
  { name: 'Croatia', iso: 'HR', dialCode: '+385' },
  { name: 'Cuba', iso: 'CU', dialCode: '+53' },
  { name: 'Cyprus', iso: 'CY', dialCode: '+357' },
  { name: 'Czech Republic', iso: 'CZ', dialCode: '+420' },
  { name: 'Denmark', iso: 'DK', dialCode: '+45' },
  { name: 'Dominican Republic', iso: 'DO', dialCode: '+1809' },
  { name: 'Ecuador', iso: 'EC', dialCode: '+593' },
  { name: 'Egypt', iso: 'EG', dialCode: '+20' },
  { name: 'El Salvador', iso: 'SV', dialCode: '+503' },
  { name: 'Estonia', iso: 'EE', dialCode: '+372' },
  { name: 'Ethiopia', iso: 'ET', dialCode: '+251' },
  { name: 'Finland', iso: 'FI', dialCode: '+358' },
  { name: 'France', iso: 'FR', dialCode: '+33' },
  { name: 'Georgia', iso: 'GE', dialCode: '+995' },
  { name: 'Germany', iso: 'DE', dialCode: '+49' },
  { name: 'Ghana', iso: 'GH', dialCode: '+233' },
  { name: 'Greece', iso: 'GR', dialCode: '+30' },
  { name: 'Guatemala', iso: 'GT', dialCode: '+502' },
  { name: 'Honduras', iso: 'HN', dialCode: '+504' },
  { name: 'Hong Kong', iso: 'HK', dialCode: '+852' },
  { name: 'Hungary', iso: 'HU', dialCode: '+36' },
  { name: 'Iceland', iso: 'IS', dialCode: '+354' },
  { name: 'India', iso: 'IN', dialCode: '+91' },
  { name: 'Indonesia', iso: 'ID', dialCode: '+62' },
  { name: 'Iran', iso: 'IR', dialCode: '+98' },
  { name: 'Iraq', iso: 'IQ', dialCode: '+964' },
  { name: 'Ireland', iso: 'IE', dialCode: '+353' },
  { name: 'Israel', iso: 'IL', dialCode: '+972' },
  { name: 'Italy', iso: 'IT', dialCode: '+39' },
  { name: 'Jamaica', iso: 'JM', dialCode: '+1876' },
  { name: 'Japan', iso: 'JP', dialCode: '+81' },
  { name: 'Jordan', iso: 'JO', dialCode: '+962' },
  { name: 'Kazakhstan', iso: 'KZ', dialCode: '+7' },
  { name: 'Kenya', iso: 'KE', dialCode: '+254' },
  { name: 'Kuwait', iso: 'KW', dialCode: '+965' },
  { name: 'Kyrgyzstan', iso: 'KG', dialCode: '+996' },
  { name: 'Laos', iso: 'LA', dialCode: '+856' },
  { name: 'Latvia', iso: 'LV', dialCode: '+371' },
  { name: 'Lebanon', iso: 'LB', dialCode: '+961' },
  { name: 'Libya', iso: 'LY', dialCode: '+218' },
  { name: 'Lithuania', iso: 'LT', dialCode: '+370' },
  { name: 'Luxembourg', iso: 'LU', dialCode: '+352' },
  { name: 'Madagascar', iso: 'MG', dialCode: '+261' },
  { name: 'Malaysia', iso: 'MY', dialCode: '+60' },
  { name: 'Maldives', iso: 'MV', dialCode: '+960' },
  { name: 'Mali', iso: 'ML', dialCode: '+223' },
  { name: 'Malta', iso: 'MT', dialCode: '+356' },
  { name: 'Mexico', iso: 'MX', dialCode: '+52' },
  { name: 'Moldova', iso: 'MD', dialCode: '+373' },
  { name: 'Mongolia', iso: 'MN', dialCode: '+976' },
  { name: 'Montenegro', iso: 'ME', dialCode: '+382' },
  { name: 'Morocco', iso: 'MA', dialCode: '+212' },
  { name: 'Mozambique', iso: 'MZ', dialCode: '+258' },
  { name: 'Myanmar', iso: 'MM', dialCode: '+95' },
  { name: 'Nepal', iso: 'NP', dialCode: '+977' },
  { name: 'Netherlands', iso: 'NL', dialCode: '+31' },
  { name: 'New Zealand', iso: 'NZ', dialCode: '+64' },
  { name: 'Nicaragua', iso: 'NI', dialCode: '+505' },
  { name: 'Niger', iso: 'NE', dialCode: '+227' },
  { name: 'Nigeria', iso: 'NG', dialCode: '+234' },
  { name: 'North Korea', iso: 'KP', dialCode: '+850' },
  { name: 'North Macedonia', iso: 'MK', dialCode: '+389' },
  { name: 'Norway', iso: 'NO', dialCode: '+47' },
  { name: 'Oman', iso: 'OM', dialCode: '+968' },
  { name: 'Pakistan', iso: 'PK', dialCode: '+92' },
  { name: 'Palestine', iso: 'PS', dialCode: '+970' },
  { name: 'Panama', iso: 'PA', dialCode: '+507' },
  { name: 'Paraguay', iso: 'PY', dialCode: '+595' },
  { name: 'Peru', iso: 'PE', dialCode: '+51' },
  { name: 'Philippines', iso: 'PH', dialCode: '+63' },
  { name: 'Poland', iso: 'PL', dialCode: '+48' },
  { name: 'Portugal', iso: 'PT', dialCode: '+351' },
  { name: 'Qatar', iso: 'QA', dialCode: '+974' },
  { name: 'Romania', iso: 'RO', dialCode: '+40' },
  { name: 'Russia', iso: 'RU', dialCode: '+7' },
  { name: 'Rwanda', iso: 'RW', dialCode: '+250' },
  { name: 'Saudi Arabia', iso: 'SA', dialCode: '+966' },
  { name: 'Senegal', iso: 'SN', dialCode: '+221' },
  { name: 'Serbia', iso: 'RS', dialCode: '+381' },
  { name: 'Singapore', iso: 'SG', dialCode: '+65' },
  { name: 'Slovakia', iso: 'SK', dialCode: '+421' },
  { name: 'Slovenia', iso: 'SI', dialCode: '+386' },
  { name: 'Somalia', iso: 'SO', dialCode: '+252' },
  { name: 'South Africa', iso: 'ZA', dialCode: '+27' },
  { name: 'South Korea', iso: 'KR', dialCode: '+82' },
  { name: 'Spain', iso: 'ES', dialCode: '+34' },
  { name: 'Sri Lanka', iso: 'LK', dialCode: '+94' },
  { name: 'Sudan', iso: 'SD', dialCode: '+249' },
  { name: 'Sweden', iso: 'SE', dialCode: '+46' },
  { name: 'Switzerland', iso: 'CH', dialCode: '+41' },
  { name: 'Syria', iso: 'SY', dialCode: '+963' },
  { name: 'Taiwan', iso: 'TW', dialCode: '+886' },
  { name: 'Tajikistan', iso: 'TJ', dialCode: '+992' },
  { name: 'Tanzania', iso: 'TZ', dialCode: '+255' },
  { name: 'Thailand', iso: 'TH', dialCode: '+66' },
  { name: 'Tunisia', iso: 'TN', dialCode: '+216' },
  { name: 'Turkey', iso: 'TR', dialCode: '+90' },
  { name: 'Turkmenistan', iso: 'TM', dialCode: '+993' },
  { name: 'Uganda', iso: 'UG', dialCode: '+256' },
  { name: 'Ukraine', iso: 'UA', dialCode: '+380' },
  { name: 'United Arab Emirates', iso: 'AE', dialCode: '+971' },
  { name: 'United Kingdom', iso: 'GB', dialCode: '+44' },
  { name: 'United States', iso: 'US', dialCode: '+1' },
  { name: 'Uruguay', iso: 'UY', dialCode: '+598' },
  { name: 'Uzbekistan', iso: 'UZ', dialCode: '+998' },
  { name: 'Venezuela', iso: 'VE', dialCode: '+58' },
  { name: 'Vietnam', iso: 'VN', dialCode: '+84' },
  { name: 'Yemen', iso: 'YE', dialCode: '+967' },
  { name: 'Zambia', iso: 'ZM', dialCode: '+260' },
  { name: 'Zimbabwe', iso: 'ZW', dialCode: '+263' },
];

const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.iso === 'UZ')!;

/**
 * Format patterns per country dial code: array of segment lengths.
 * E.g. [2, 3, 2, 2] => "XX XXX XX XX"
 */
const PHONE_MASKS: Record<string, number[]> = {
  '+998': [2, 3, 2, 2], // Uzbekistan: 90 123 45 67
  '+1': [3, 3, 4], // US/Canada: (XXX) XXX-XXXX
  '+7': [3, 3, 2, 2], // Russia/Kazakhstan: XXX XXX-XX-XX
  '+44': [4, 3, 4], // UK: XXXX XXX XXXX
  '+91': [5, 5], // India: XXXXX XXXXX
  '+81': [4, 4], // Japan: XXXX XXXX
  '+86': [3, 4, 4], // China: XXX XXXX XXXX
  '+49': [3, 3, 4, 2], // Germany: XXX XXX XXXX
  '+33': [1, 2, 2, 2, 2], // France
  '+39': [3, 3, 4], // Italy
  '+34': [3, 3, 3], // Spain
  '+90': [3, 3, 2, 2], // Turkey: XXX XXX XX XX
  '+994': [2, 3, 2, 2], // Azerbaijan
  '+996': [3, 3, 3], // Kyrgyzstan
  '+992': [2, 2, 2, 2], // Tajikistan
  '+993': [2, 2, 2, 2], // Turkmenistan
};

const DEFAULT_MASK = [3, 3, 4]; // XXX XXX XXXX

function getMaskForDialCode(dialCode: string): number[] {
  return PHONE_MASKS[dialCode] ?? DEFAULT_MASK;
}

function formatPhoneDigits(digits: string, mask: number[]): string {
  let i = 0;
  const parts: string[] = [];
  for (const len of mask) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + len));
    i += len;
  }
  return parts.join(' ').trim();
}

function parsePhoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  placeholder?: string;
}

const MAX_PHONE_DIGITS = 15;

const PhoneInput = ({
  value,
  onChange,
  selectedCountry,
  onCountryChange,
  placeholder = '90 123 45 67',
}: PhoneInputProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const mask = getMaskForDialCode(selectedCountry.dialCode);
  const digits = parsePhoneDigits(value);
  const displayValue = formatPhoneDigits(digits, mask);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const newDigits = parsePhoneDigits(raw).slice(0, MAX_PHONE_DIGITS);
    onChange(newDigits);
  };

  // Focus search input when picker opens
  useEffect(() => {
    if (pickerOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearch('');
    }
  }, [pickerOpen]);

  const filteredCountries = search
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dialCode.includes(search) ||
          c.iso.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES;

  const handleSelect = (country: Country) => {
    onCountryChange(country);
    setPickerOpen(false);
  };

  return (
    <>
      {/* Phone input pill — border only, no background */}
      <div
        className="flex items-center w-full rounded-full border border-white/30 overflow-hidden
                    focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-colors"
      >
        {/* Country picker trigger */}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 pl-5 pr-3 py-4 shrink-0 border-r border-white/20"
        >
          <CountryFlag iso={selectedCountry.iso} size={22} />
          <span className="text-sm text-white font-medium">{selectedCountry.dialCode}</span>
          <IoChevronDown className="text-xs text-white/50" />
        </button>

        {/* Phone number input with mask */}
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={displayValue}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className="flex-1 px-4 py-4 text-sm text-white placeholder:text-white/40 outline-none bg-transparent"
        />
      </div>

      {/* Country picker modal */}
      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-white"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] border-b border-gray-100">
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
              >
                <IoClose className="text-xl" />
              </button>
              <div className="flex-1 relative">
                <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-full bg-gray-100 text-sm text-gray-900
                             placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Country list */}
            <div className="flex-1 overflow-y-auto">
              {filteredCountries.map((country) => (
                <button
                  key={country.iso}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors
                    ${country.iso === selectedCountry.iso ? 'bg-blue-50' : 'hover:bg-gray-50 active:bg-gray-100'}`}
                >
                  <CountryFlag iso={country.iso} size={24} />
                  <span className="flex-1 text-sm text-gray-900">{country.name}</span>
                  <span className="text-sm text-gray-500">{country.dialCode}</span>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">No countries found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { COUNTRIES, DEFAULT_COUNTRY };
export default PhoneInput;
