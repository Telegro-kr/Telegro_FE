import { useParams } from 'react-router-dom';

export default function AdminUserDetail() {
  const { userId } = useParams<{ userId: string }>();
  return <h1>Admin User Detail - #{userId}</h1>;
}
