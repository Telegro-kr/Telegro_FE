import NoticeDetailContainer from '@components/notice-detail/notice-detail-container';
import { useNavigate, useParams } from 'react-router-dom';

const NoticeDetail = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId: string }>();

  return (
    <NoticeDetailContainer
      noticeId={Number(noticeId) || undefined}
      onGoList={() => navigate('/notices')}
      onOpenNotice={(id) => navigate(`/notices/${id}`)}
    />
  );
};

export default NoticeDetail;
