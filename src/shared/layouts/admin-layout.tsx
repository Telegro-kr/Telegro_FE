import { Outlet, Link } from 'react-router-dom';

const linkClass =
  'title6 text-gray-900 no-underline transition-underline hover:underline';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 z-10 w-full border-b border-[#eee] bg-white px-[3rem] py-[1.6rem]">
        <nav className="flex gap-[3rem] px-[3rem]">
          <Link to="/admin" className={linkClass}>
            Dashboard
          </Link>
          <Link to="/admin/users" className={linkClass}>
            Users
          </Link>
          <Link to="/admin/products" className={linkClass}>
            Product
          </Link>
          <Link to="/admin/orders" className={linkClass}>
            Order
          </Link>
        </nav>
      </header>

      <main className="bg-bg px-4 pt-[5rem]">
        <Outlet />
      </main>

      <footer className="border-t border-[#eee] px-3 py-3">© Admin</footer>
    </div>
  );
};

export default AdminLayout;
