import Icon from '@components/common/icon';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';

const GlobalSiteToast = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-[3rem] left-[3.5rem] z-[85] max-w-[calc(100vw-4rem)]">
      <div className="inline-flex items-start gap-2 rounded-[12px] bg-[#3A3A3B] px-[10px] py-[12px] shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
        <div className="pt-[1px]">
          <Icon name="global-toast" className="text-gray-300" size={2.0} />
        </div>

        <p className="w-[404px] max-w-[calc(100vw-12rem)] text-[14px] leading-[21px] font-medium break-words whitespace-pre-line text-white">
          본사이트는 기업전용 사이트로 일반고객은 제품구매를 하실 수 없습니다.
          제품문의 및 구매는 KJ대리점으로 문의하시기 바랍니다.
          {'\n'}
          제품출고일 : 매주 목요일(오후3시 접수마감) 입니다.
        </p>

        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="안내 닫기"
          className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-75"
        >
          <IoClose size={18} />
        </button>
      </div>
    </div>
  );
};

export default GlobalSiteToast;
