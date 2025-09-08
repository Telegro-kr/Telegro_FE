import { Link } from 'react-router-dom';

export default function Checkout() {
  return (
    <section>
      <h1>Checkout (in progress)</h1>
      <Link to="/app/checkout/complete">Complete</Link>
    </section>
  );
}
