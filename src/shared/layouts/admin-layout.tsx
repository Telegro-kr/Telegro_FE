import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Outlet, Link, useLocation } from 'react-router-dom';

const linkClass =
  'title6 text-gray-900 no-underline transition-underline hover:underline';

const mobileLinkClass =
  'title6 rounded-[1rem] px-[0.6rem] py-[0.8rem] text-gray-900 no-underline transition-underline hover:underline';

const AdminLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 z-50 w-full border-b border-[#eee] bg-white px-[3rem] py-[1.6rem] max-[500px]:px-[1.6rem] max-[500px]:py-[1.2rem]">
        <nav className="px-[3rem] max-[500px]:px-0">
          <div className="flex gap-[3rem] max-[500px]:justify-between max-[500px]:gap-[1.2rem]">
            <div className="hidden items-center gap-[1.2rem] max-[500px]:flex">
              <button
                type="button"
                aria-label={isMobileMenuOpen ? '관리자 메뉴 닫기' : '관리자 메뉴 열기'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="admin-mobile-menu"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="rounded-full p-[0.6rem] text-[#121212] transition-colors hover:bg-black/5"
              >
                {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
              <Link to="/admin" className="title3_bold text-primary no-underline">
                Telegro
              </Link>
            </div>

            <Link to="/admin" className={`${linkClass} max-[500px]:hidden`}>
              Dashboard
            </Link>
            <Link to="/admin/users" className={`${linkClass} max-[500px]:hidden`}>
              Users
            </Link>
            <Link
              to="/admin/products"
              className={`${linkClass} max-[500px]:hidden`}
            >
              Product
            </Link>
            <Link to="/admin/orders" className={`${linkClass} max-[500px]:hidden`}>
              Order
            </Link>
            <Link to="/admin/notices" className={`${linkClass} max-[500px]:hidden`}>
              Notice
            </Link>
          </div>

          <div
            id="admin-mobile-menu"
            className={`hidden overflow-hidden transition-all duration-300 ease-out max-[500px]:mt-[1.2rem] max-[500px]:block ${
              isMobileMenuOpen ? 'max-[500px]:max-h-[32rem]' : 'max-[500px]:max-h-0'
            }`}
          >
            <div className="flex flex-col gap-[0.8rem] border-t border-[#f0f0f0] pt-[1.2rem]">
              <Link to="/admin" className={mobileLinkClass}>
                Dashboard
              </Link>
              <Link to="/admin/users" className={mobileLinkClass}>
                Users
              </Link>
              <Link to="/admin/products" className={mobileLinkClass}>
                Product
              </Link>
              <Link to="/admin/orders" className={mobileLinkClass}>
                Order
              </Link>
              <Link to="/admin/notices" className={mobileLinkClass}>
                Notice
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="bg-bg px-4 pt-[5rem]">
        <Outlet />
      </main>

      <footer className="border-t border-[#eee] px-3 py-3">짤 Admin</footer>
    </div>
  );
};

export default AdminLayout;
