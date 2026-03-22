import NoticeDetailContainer from '@components/notice-detail/notice-detail-container';
import { useNavigate, useParams } from 'react-router-dom';

const AdminNoticeDetailPage = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();

  return (
    <NoticeDetailContainer
      noticeId={Number(noticeId) || undefined}
      onGoList={() => navigate('/admin/notices')}
      onOpenNotice={(id) => navigate(`/admin/notices/${id}`)}
    />
  );
};

export default AdminNoticeDetailPage;
