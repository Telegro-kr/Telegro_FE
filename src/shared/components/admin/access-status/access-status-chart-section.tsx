import { useAccessStatusChart } from '@hooks/use-access-status-chart';
import { AccessStatusChartSectionView } from '@components/admin/access-status/access-status-chart-view';

const AccessStatusChartSection = () => {
  const chartState = useAccessStatusChart();

  return <AccessStatusChartSectionView {...chartState} />;
};

export default AccessStatusChartSection;
