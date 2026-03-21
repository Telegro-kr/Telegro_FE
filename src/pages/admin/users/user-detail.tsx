import { useParams } from 'react-router-dom';

const AdminUserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  return <h1>Admin User Detail - #{userId}</h1>;
};

export default AdminUserDetail;
