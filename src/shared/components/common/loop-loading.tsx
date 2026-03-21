import pandaLoading from '/panda-loading.svg';

type LoopLoadingProps = {
  size?: number;
};

const LoopLoading = ({ size = 200 }: LoopLoadingProps) => {
  return (
    <div
      className="relative flex items-center justify-center rounded-full"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          strokeWidth="11"
          fill="none"
          className="stroke-[#E9E9E9]"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="45 240"
          strokeDashoffset="100"
          className="origin-center animate-spin stroke-[#FFC633]"
        />
      </svg>
      <img
        src={pandaLoading}
        className="absolute w-[50%]"
        alt="로딩 중인 판다"
      />
    </div>
  );
};

export default LoopLoading;
