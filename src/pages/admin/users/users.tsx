import { Link } from 'react-router-dom';

export default function AdminUsers() {
  return (
    <section>
      <h1>Admin Users (List)</h1>
      <Link to="/admin/users/create">+ Create User</Link>
      <ul>
        <li>
          <Link to="/admin/users/1">User #1</Link>
        </li>
        <li>
          <Link to="/admin/users/2">User #2</Link>
        </li>
      </ul>
    </section>
  );
}
