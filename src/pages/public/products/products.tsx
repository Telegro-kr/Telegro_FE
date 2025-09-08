import { Link } from 'react-router-dom';

export default function PublicProducts() {
  // 탭/필터는 추후 구현
  return (
    <section>
      <h1>Products (Public List)</h1>
      <ul>
        <li>
          <Link to="/products/1">Go Product #1</Link>
        </li>
        <li>
          <Link to="/products/2">Go Product #2</Link>
        </li>
      </ul>
    </section>
  );
}
