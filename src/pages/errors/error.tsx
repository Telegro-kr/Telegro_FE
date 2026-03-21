import ErrorView from '@components/errors/error-view';
import { useNavigate, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  if (error) {
    console.error(error);
  }

  return <ErrorView onGoHome={() => navigate('/')} />;
};

export default ErrorPage;
