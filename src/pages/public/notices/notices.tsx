import { Link } from 'react-router-dom';

export default function Notices() {
  return (
    <section>
      <h1>Notices (List)</h1>
      <ul>
        <li>
          <Link to="/notices/101">Notice #101</Link>
        </li>
        <li>
          <Link to="/notices/102">Notice #102</Link>
        </li>
      </ul>
    </section>
  );
}
