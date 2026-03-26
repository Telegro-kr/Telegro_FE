import { Outlet } from 'react-router-dom';
import PublicFooter from './public-footer';
import PublicHeader from './public-header';

const MemberLayout = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#fafafa] text-[#121212]">
      <PublicHeader />
      <main className="w-full pt-[8.2rem]">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default MemberLayout;
