import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div>
      <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/notices">Notices</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </nav>
      </header>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
      <footer style={{ padding: 12, borderTop: '1px solid #eee' }}>
        © Public
      </footer>
    </div>
  );
}
