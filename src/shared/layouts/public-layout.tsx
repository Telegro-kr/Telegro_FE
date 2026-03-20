import { Outlet } from 'react-router-dom';
import PublicFooter from './public-footer';
import PublicHeader from './public-header';

export default function PublicLayout() {
  return (
    <div className="min-h-screen w-full bg-[#fafafa] text-[#121212]">
      <PublicHeader />
      <main className="w-full">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
