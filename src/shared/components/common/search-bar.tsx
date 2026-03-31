import { cn } from '@utils/cn';
import React, { useMemo, useState } from 'react';
import { FiChevronDown, FiRefreshCw } from 'react-icons/fi';

type SearchBarSize = 'md' | 'lg';

type SearchBarProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  buttonText?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: SearchBarSize;
  autoFocus?: boolean;
  submitOnEmpty?: boolean;
  className?: string;
  inputWrapClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  filterText?: string;
  filterButtonClassName?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onFilterClick?: () => void;
};

const sizeClasses: Record<
  SearchBarSize,
  {
    rootGap: string;
    inputWrap: string;
    input: string;
    button: string;
    icon: string;
    buttonText: string;
    refreshButton: string;
    refreshIcon: string;
    filterButton: string;
    filterText: string;
    filterIcon: string;
  }
> = {
  md: {
    rootGap: 'gap-4',
    inputWrap: 'h-[5.3rem] rounded-full px-6',
    input: 'text-lg',
    button: 'h-[5.3rem] rounded-2xl px-7',
    icon: 'h-7 w-7',
    buttonText: 'text-xl',
    refreshButton: 'h-[5.3rem] w-[5.3rem] rounded-full',
    refreshIcon: 'h-6 w-6',
    filterButton: 'h-[5.3rem] rounded-[12px] px-7',
    filterText: 'text-xl',
    filterIcon: 'h-5 w-5',
  },
  lg: {
    rootGap: 'gap-5',
    inputWrap: 'h-[5.3rem] rounded-full px-8',
    input: 'body3',
    button: 'h-[5.3rem] rounded-[12px] px-10',
    icon: 'h-9 w-9',
    buttonText: 'body3',
    refreshButton: 'h-[5.3rem] w-[5.3rem] rounded-full',
    refreshIcon: 'h-7 w-7',
    filterButton: 'h-[5.3rem] rounded-[12px] px-8',
    filterText: 'body3',
    filterIcon: 'h-5 w-5',
  },
};

const SearchIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 12.5163 16.71 13.9065 15.811 14.9883L19.5303 18.7197C19.8232 19.0126 19.8232 19.4874 19.5303 19.7803C19.2641 20.0466 18.8474 20.0708 18.5537 19.8535L18.4697 19.7803L14.7383 16.061C13.6565 16.96 12.2663 17.5 10.75 17.5C7.29822 17.5 4.5 14.7018 4.5 11.25C4.5 7.79822 7.29822 5 10.75 5L11 4.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SearchBar = ({
  value,
  defaultValue = '',
  placeholder = '찾으시는 항목명을 입력해 주세요.',
  buttonText = '검색하기',
  disabled = false,
  loading = false,
  size = 'lg',
  autoFocus = false,
  submitOnEmpty = false,
  className,
  inputWrapClassName,
  inputClassName,
  buttonClassName,
  filterText,
  filterButtonClassName,
  onChange,
  onSearch,
  onRefresh,
  onFilterClick,
}: SearchBarProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);

  const currentValue = isControlled ? value : internalValue;
  const styles = sizeClasses[size];
  const hasFilterButton = Boolean(filterText);

  const isSubmitDisabled = useMemo(() => {
    if (disabled || loading) return true;
    if (submitOnEmpty) return false;
    return currentValue.trim().length === 0;
  }, [currentValue, disabled, loading, submitOnEmpty]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) return;

    onSearch?.(currentValue.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex w-full items-center', styles.rootGap, className)}
      role="search"
    >
      <button
        type="button"
        aria-label="검색 초기화"
        disabled={disabled || loading}
        onClick={onRefresh}
        className={cn(
          'flex-row-center shrink-0 cursor-pointer bg-[#F5F5F5] text-gray-600 transition',
          'hover:bg-[#EBEBEB] hover:text-[#5F5F5F] disabled:cursor-not-allowed disabled:opacity-60',
          styles.refreshButton,
        )}
      >
        <FiRefreshCw className={styles.refreshIcon} />
      </button>

      <div
        className={cn(
          'flex min-w-0 flex-1 items-center bg-[#F5F5F5] text-[#B5B5B5]',
          styles.inputWrap,
          inputWrapClassName,
        )}
      >
        <SearchIcon className={cn('shrink-0 text-[#B5B5B5]', styles.icon)} />

        <input
          type="text"
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || loading}
          autoFocus={autoFocus}
          className={cn(
            'ml-4 h-full w-full border-none bg-transparent pr-2 font-normal text-[#2B2B2B] outline-none placeholder:text-[#B5B5B5]',
            styles.input,
            inputClassName,
          )}
        />
      </div>

      {hasFilterButton ? (
        <button
          type="button"
          disabled={disabled || loading}
          onClick={onFilterClick}
          className={cn(
            'flex-row-center shrink-0 cursor-pointer gap-3 bg-[#F5F5F5] font-medium text-[#2B2B2B] transition',
            'hover:bg-[#EBEBEB] disabled:cursor-not-allowed disabled:opacity-60',
            styles.filterButton,
            styles.filterText,
            filterButtonClassName,
          )}
        >
          <span>{filterText}</span>
          <FiChevronDown className={styles.filterIcon} />
        </button>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className={cn(
          'shrink-0 bg-[#FFC633] font-medium text-white transition',
          'hover:bg-[#f0bb2f] disabled:cursor-not-allowed disabled:bg-[#FFE08A] disabled:text-white/80',
          styles.button,
          styles.buttonText,
          buttonClassName,
        )}
      >
        {loading ? '검색 중...' : buttonText}
      </button>
    </form>
  );
};

export default SearchBar;
