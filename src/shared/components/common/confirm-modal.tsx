import { createPortal } from 'react-dom';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  message = '정말 완료하시겠습니까?',
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
}: ConfirmModalProps) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="flex-row-center fixed inset-0 z-[999] bg-black/30 px-[3.5rem]">
      <div className="flex-col-center w-[32rem] gap-[3rem] rounded-[16px] bg-white px-[2rem] py-[3rem]">
        <p className="title6 text-center text-gray-900">{message}</p>

        <div className="flex w-full gap-[0.8rem]">
          <button
            type="button"
            onClick={onCancel}
            className="button3 h-[4.8rem] flex-1 cursor-pointer rounded-[8px] border border-gray-200 bg-white text-gray-900"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="button3 bg-primary h-[4.8rem] flex-1 cursor-pointer rounded-[8px] text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
