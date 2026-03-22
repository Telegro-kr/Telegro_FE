import AdminNoticeDetailContainer from '@components/admin/notice-detail/admin-notice-detail-container';
import { useNavigate, useParams } from 'react-router-dom';

const AdminNoticeDetailPage = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();

  return (
    <AdminNoticeDetailContainer
      noticeId={Number(noticeId) || undefined}
      onGoList={() => navigate('/admin/notices')}
      onOpenNotice={(id) => navigate(`/admin/notices/${id}`)}
    />
  );
};

export default AdminNoticeDetailPage;
