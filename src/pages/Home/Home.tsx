import { useHome } from './useHome';
import HomeLayout from './components/HomeLayout';
import SearchBar from './components/SearchBar';
import CategoryFilters from './components/CategoryFilters';
import PopularProducts from './components/PopularProducts';

const Home = () => {
  useHome();
  return (
    <HomeLayout>
      <SearchBar />
      <CategoryFilters />
      <PopularProducts />
    </HomeLayout>
  );
};

export default Home;
