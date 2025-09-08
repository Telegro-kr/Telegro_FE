import { Link } from 'react-router-dom';

export default function Orders() {
  return (
    <section>
      <h1>Orders (Member)</h1>
      <ul>
        <li>
          <Link to="/app/orders/5001">Order #5001</Link>
        </li>
        <li>
          <Link to="/app/orders/5002">Order #5002</Link>
        </li>
      </ul>
    </section>
  );
}
