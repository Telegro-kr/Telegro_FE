import { cn } from '@libs/cn';

type ActionSelectButtonProps = {
  label: string;
  isOpen: boolean;
  onClick: () => void;
};

const ActionSelectButton = ({
  label,
  isOpen,
  onClick,
}: ActionSelectButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-row-center h-11 gap-2 rounded-xl px-4 text-[1.5rem] font-semibold tracking-[-0.02em] text-gray-800 transition-colors duration-200',
        isOpen ? 'bg-[#F8F9FA]' : 'bg-transparent hover:bg-[#F8F9FA]',
      )}
    >
      <span>{label}</span>
      <svg
        className={cn(
          'h-5 w-5 shrink-0 text-gray-700 transition-transform duration-200',
          isOpen ? 'rotate-180' : 'rotate-0',
        )}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 6L8 11L13 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default ActionSelectButton;
