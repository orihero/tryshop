import { IoSearchOutline, IoOptionsOutline } from 'react-icons/io5';
import { useTranslation } from '@/hooks/useTranslation';

const SearchBar = () => {
  const { t } = useTranslation();

  return (
    <div className="font-roboto px-4 mb-4 flex items-center gap-2">
      {/* Search input */}
      <div className="flex-1 relative">
        <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder={t('search')}
          className="font-roboto w-full pl-12 pr-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      {/* Filter button */}
      <button className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
        <IoOptionsOutline className="text-gray-600 text-xl" />
      </button>
    </div>
  );
};

export default SearchBar;
