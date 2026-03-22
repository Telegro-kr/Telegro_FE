import {
  useAdminNoticeDetail,
  type AdminNoticeDetailItem,
} from '@hooks/use-admin-notice-detail';
import AdminNoticeDetailView from '@components/admin/notice-detail/admin-notice-detail-view';

type NoticeDetailContainerProps = {
  noticeId?: number;
  notices?: AdminNoticeDetailItem[];
  onBack?: () => void;
  onGoList?: () => void;
  onOpenNotice?: (noticeId: number) => void;
};

const NoticeDetailContainer = (props: NoticeDetailContainerProps) => {
  const detailState = useAdminNoticeDetail(props);

  return <AdminNoticeDetailView {...detailState} />;
};

export default NoticeDetailContainer;
