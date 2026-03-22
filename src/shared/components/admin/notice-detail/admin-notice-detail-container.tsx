import {
  useAdminNoticeDetail,
  type AdminNoticeDetailItem,
} from '@hooks/use-admin-notice-detail';
import AdminNoticeDetailView from '@components/admin/notice-detail/admin-notice-detail-view';

type AdminNoticeDetailContainerProps = {
  noticeId?: number;
  notices?: AdminNoticeDetailItem[];
  onBack?: () => void;
  onGoList?: () => void;
  onOpenNotice?: (noticeId: number) => void;
};

const AdminNoticeDetailContainer = (
  props: AdminNoticeDetailContainerProps,
) => {
  const detailState = useAdminNoticeDetail(props);

  return <AdminNoticeDetailView {...detailState} />;
};

export default AdminNoticeDetailContainer;
