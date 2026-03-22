import AccessStatusChartSection from '@components/admin/access-status/access-status-chart-section';
import NoticeSectionContainer from '@components/admin/notice/notice-section-container';

const AdminDashboard = () => {
  return (
    <div className="mx-auto w-full flex-col gap-[7rem] px-[10rem] py-[10rem]">
      <AccessStatusChartSection />
      <NoticeSectionContainer
        onClickAll={() => {
          console.log('전체 공지사항 보기');
        }}
      />
    </div>
  );
};

export default AdminDashboard;
