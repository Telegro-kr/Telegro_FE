import { Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div>
      <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/users/create">Create User</Link>
          <Link to="/admin/products/create">Create Product</Link>
          <Link to="/">Public</Link>
        </nav>
      </header>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
      <footer style={{ padding: 12, borderTop: '1px solid #eee' }}>
        © Admin
      </footer>
    </div>
  );
}
