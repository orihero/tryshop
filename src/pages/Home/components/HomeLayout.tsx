import type { ReactNode } from 'react';
import SearchBar from './SearchBar';
import CategoryFilters from './CategoryFilters';
import PopularProducts from './PopularProducts';

interface HomeLayoutProps {
  children?: ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  const content = children ?? (
    <>
      <SearchBar />
      <CategoryFilters />
      <PopularProducts />
    </>
  );

  return (
    <div className="font-roboto min-h-screen bg-[#FAF9F6] relative overflow-visible pb-24">
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 Q300,50 600,100 T1200,100 L1200,0 L0,0 Z"
            fill="rgba(245, 222, 179, 0.3)"
          />
          <path
            d="M0,120 Q400,80 800,120 T1200,120 L1200,0 L0,0 Z"
            fill="rgba(245, 222, 179, 0.2)"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 Q300,150 600,100 T1200,100 L1200,200 L0,200 Z"
            fill="rgba(245, 222, 179, 0.3)"
          />
          <path
            d="M0,80 Q400,120 800,80 T1200,80 L1200,200 L0,200 Z"
            fill="rgba(245, 222, 179, 0.2)"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="pt-4">{content}</div>
      </div>
    </div>
  );
};

export default HomeLayout;
