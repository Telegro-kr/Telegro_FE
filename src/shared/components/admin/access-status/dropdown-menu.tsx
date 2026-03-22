import { cn } from '@libs/cn';
import { type DropdownOption } from '@hooks/use-access-status-chart';

type DropdownMenuProps<T extends string> = {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

const DropdownMenu = <T extends string>({
  options,
  value,
  onChange,
}: DropdownMenuProps<T>) => {
  return (
    <div className="absolute top-[calc(100%+0.625rem)] right-0 z-30 min-w-[12rem] rounded-2xl border border-[#F0F0F0] bg-white p-2.5 shadow-[0_12px_30px_rgba(17,17,17,0.08)]">
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'body4 flex-row-between min-h-[2rem] w-full cursor-pointer rounded-xl px-4 py-3 text-left transition-colors',
              active
                ? 'bg-[#FFF4CF] text-[#1A1A1A]'
                : 'text-[#515468] hover:bg-[#F8F9FA]',
            )}
          >
            <span>{option.label}</span>
            {active && (
              <svg
                viewBox="0 0 20 20"
                className="text-primary h-6 w-6"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10.5L8 14.5L16 6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DropdownMenu;
