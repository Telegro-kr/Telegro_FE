import { Outlet, Link } from 'react-router-dom';

export default function MemberLayout() {
  return (
    <div>
      <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/app/cart">Cart</Link>
          <Link to="/app/checkout">Checkout</Link>
          <Link to="/app/orders">Orders</Link>
          <Link to="/app/my">My</Link>
          <Link to="/">Back to Public</Link>
        </nav>
      </header>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
      <footer style={{ padding: 12, borderTop: '1px solid #eee' }}>
        © Member
      </footer>
    </div>
  );
}
