import { useEffect } from 'react';

declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Channel?: {
        chat: (options: { channelPublicId: string }) => void;
      };
    };
  }
}

const KAKAO_APP_KEY = '9d7e3bf3d02c6226c026fb519c6e9e7e';
const KAKAO_CHANNEL_PUBLIC_ID = '_xoqEEn';
const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_xoqEEn/chat';
const KAKAO_SDK_URL = 'https://developers.kakao.com/sdk/js/kakao.min.js';

const initializeKakao = () => {
  if (!window.Kakao) return false;

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_APP_KEY);
  }

  return Boolean(window.Kakao.Channel);
};

export default function ChatButton() {
  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${KAKAO_SDK_URL}"]`,
    );

    const handleReady = () => {
      initializeKakao();
    };

    if (window.Kakao) {
      handleReady();
      return;
    }

    if (existingScript) {
      existingScript.addEventListener('load', handleReady);

      return () => {
        existingScript.removeEventListener('load', handleReady);
      };
    }

    const script = document.createElement('script');
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.addEventListener('load', handleReady);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', handleReady);
    };
  }, []);

  const handleChatClick = () => {
    if (initializeKakao() && window.Kakao?.Channel) {
      window.Kakao.Channel.chat({
        channelPublicId: KAKAO_CHANNEL_PUBLIC_ID,
      });
      return;
    }

    window.open(KAKAO_CHANNEL_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleChatClick}
      aria-label="카카오톡 채널 채팅하기"
      className="fixed right-[3rem] bottom-[1.6rem] z-40 cursor-pointer"
    >
      <img
        src="https://vendor-cdn.imweb.me/images/kakao-talk-button-default.svg"
        alt="카카오톡 채널 채팅하기 버튼"
        className="h-[7rem] w-[7rem] md:h-[7.4rem] md:w-[7.4rem]"
      />
    </button>
  );
}
