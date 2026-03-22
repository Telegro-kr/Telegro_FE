import AccessStatusChartSection from '@components/admin/access-status/access-status-chart-section';

const AdminDashboard = () => {
  return (
    <div className="mx-auto w-full max-w-[120rem] px-4 py-8 md:px-6">
      <AccessStatusChartSection />
    </div>
  );
};

export default AdminDashboard;
