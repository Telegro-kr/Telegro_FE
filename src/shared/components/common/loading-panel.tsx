import { cn } from '@utils/cn';
import LoopLoading from '@components/common/loop-loading';

type LoadingPanelProps = {
  className?: string;
  size?: number;
  fullScreen?: boolean;
};

const LoadingPanel = ({
  className,
  size = 120,
  fullScreen = false,
}: LoadingPanelProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-[1.6rem] bg-white px-[2.2rem] py-[3.2rem]',
        fullScreen && 'min-h-screen rounded-none bg-[#FBFBF8]',
        className,
      )}
    >
      <LoopLoading size={size} />
    </div>
  );
};

export default LoadingPanel;
