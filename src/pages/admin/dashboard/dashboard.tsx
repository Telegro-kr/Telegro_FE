import AccessStatusChartSection from '@components/admin/access-status/access-status-chart-section';
import NoticeSectionContainer from '@components/admin/notice/notice-section-container';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full flex-col gap-[7rem] px-[10rem] py-[10rem]">
      <AccessStatusChartSection />
      <NoticeSectionContainer
        onClickAll={() => {
          navigate(`/admin/notices`);
        }}
        onClickNotice={(noticeId) => {
          navigate(`/admin/notices/${noticeId}`);
        }}
      />
    </div>
  );
};

export default AdminDashboard;
