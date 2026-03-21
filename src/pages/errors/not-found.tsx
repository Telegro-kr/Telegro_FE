import NotFoundView from '@components/errors/not-found-view';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return <NotFoundView onGoHome={() => navigate('/')} />;
};

export default NotFound;
