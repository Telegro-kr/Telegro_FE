import LoopLoading from '@components/common/loop-loading';
import { cn } from '@libs/cn';

type LoadingPageProps = {
  noLayout?: boolean;
};

const LoadingPage = ({ noLayout = false }: LoadingPageProps) => {
  return (
    <section className="min-h-screen bg-[#FAFAFA] p-0">
      <div
        className={cn(
          'flex-col-center bg-white shadow-[0_4px_21px_rgba(85,128,20,0.12)]',
          noLayout
            ? 'm-10 min-h-[calc(100vh-5rem)] rounded-[5rem]'
            : 'mt-[3.75rem] mb-10 min-h-[calc(100vh-8rem)] rounded-l-[5rem]',
        )}
      >
        <LoopLoading />
        <span className="mt-10 text-[2.5rem] font-semibold text-[#2B2B2B]">
          잠시만 기다려주세요
        </span>
        <span className="text-2xl font-medium text-[#6D6D6D]">
          해당 페이지로 이동중입니다!
        </span>
      </div>
    </section>
  );
};

export default LoadingPage;
