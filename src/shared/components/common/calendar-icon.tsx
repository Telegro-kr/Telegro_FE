const CalendarIcon = () => {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[16px] w-[16px]"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4.5"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6.5 3V6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M13.5 3V6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M3 8H17" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
};

export default CalendarIcon;
