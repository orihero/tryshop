import { Outlet } from 'react-router-dom';
import BottomTabBar from '@/pages/Home/components/BottomTabBar';

const MainTabLayout = () => {
  return (
    <>
      <Outlet />
      <BottomTabBar />
    </>
  );
};

export default MainTabLayout;
