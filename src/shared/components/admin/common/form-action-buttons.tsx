type FormActionButtonsProps = {
  isSubmitting: boolean;
  isSubmitDisabled?: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
  submitType?: 'button' | 'submit';
  submitLabel: string;
  submittingLabel: string;
};

const cancelButtonClassName =
  'inline-flex h-[5rem] cursor-pointer items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-white px-[4rem] text-[1.5rem] font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60';

const submitButtonClassName =
  'inline-flex h-[5rem] cursor-pointer items-center justify-center rounded-[10px] border border-[#FFB86B] bg-[#FF9B2F] px-[4rem] text-[1.5rem] font-semibold text-white shadow-[0_16px_34px_rgba(255,155,47,0.18)] transition hover:bg-[#F08D22] disabled:cursor-not-allowed disabled:opacity-60';

const FormActionButtons = ({
  isSubmitting,
  isSubmitDisabled = false,
  onCancel,
  onSubmit,
  submitType = 'button',
  submitLabel,
  submittingLabel,
}: FormActionButtonsProps) => {
  return (
    <div className="flex flex-col-reverse gap-[1rem] pt-[0.8rem] sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className={cancelButtonClassName}
      >
        취소
      </button>
      <button
        type={submitType}
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className={submitButtonClassName}
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </div>
  );
};

export default FormActionButtons;
