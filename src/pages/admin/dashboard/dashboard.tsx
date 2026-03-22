import AccessStatusChartSection from '@components/admin/access-status/access-status-chart-section';
import NoticeSectionContainer from '@components/admin/notice/notice-section-container';
import { useNavigate } from 'react-router-dom';
import AdminProfileCard from '@components/admin/profile-card/profile-card';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full flex-col gap-[7rem] px-[2rem] py-[5rem] md:px-[3rem] lg:px-[10rem]">
      <AdminProfileCard onMove={() => navigate('/')} />
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
