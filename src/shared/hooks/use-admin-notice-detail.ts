import { useMemo } from 'react';

export type AdminNoticeDetailItem = {
  id: number;
  title: string;
  summary: string;
  content: string[];
  views: number;
  createdAt: string;
  relativeLabel?: string;
  author?: string;
};

export type AdminNoticeSibling = {
  id: number;
  title: string;
  createdAt: string;
};

type UseAdminNoticeDetailParams = {
  noticeId?: number;
  notices?: AdminNoticeDetailItem[];
  onBack?: () => void;
  onGoList?: () => void;
  onOpenNotice?: (noticeId: number) => void;
};

const DEFAULT_NOTICE_LIST: AdminNoticeDetailItem[] = [
  {
    id: 52,
    title: '새로워진 텔레그로 관리자 플랫폼의 변경 사항 안내 드립니다.',
    summary:
      '2026년 3월 30일 월요일, 달라지는 텔레그로 관리자 플랫폼의 주요 변경 사항을 상세히 안내드립니다.',
    content: [
      '안녕하세요, 텔레그로 운영팀입니다.',
      '이번 공지에서는 새로워진 관리자 플랫폼에서 달라지는 구조와 기능을 안내드립니다. 보다 직관적인 정보 확인이 가능하도록 화면 구성을 정리했고, 자주 사용하는 메뉴와 관리 흐름도 함께 재구성했습니다.',
      '새로운 관리자 화면에서는 대시보드, 공지사항, 상품 관리 등 주요 기능을 더 쉽게 확인할 수 있으며, 목록 화면과 상세 화면 모두에서 정보 위계를 명확하게 볼 수 있도록 타이포그래피와 간격을 세밀하게 조정했습니다.',
      '또한 기존 운영 방식에서 일부 용어와 위치가 변경되었기 때문에, 자주 사용하는 관리 메뉴가 있다면 한 번씩 새 구조를 확인해 주시길 바랍니다.',
      '앞으로도 더 안정적인 운영 환경을 제공할 수 있도록 지속적으로 개선하겠습니다. 감사합니다.',
    ],
    views: 99,
    createdAt: '2026-03-18',
    relativeLabel: '22시간 전',
    author: '텔레그로 운영팀',
  },
  {
    id: 51,
    title: '통합 플랫폼 전환에 따른 디스플레이 광고 리포트 변경 사항 안내',
    summary: '통합 플랫폼 전환에 따른 주요 리포트 변경 내용을 안내드립니다.',
    content: ['이전 공지입니다.'],
    views: 99,
    createdAt: '2026-03-17',
    author: '텔레그로 운영팀',
  },
  {
    id: 50,
    title: '플레이스광고 음식점 업종 검색 결과 개편 추가 테스트 안내',
    summary: '다음 공지입니다.',
    content: ['다음 공지입니다.'],
    views: 73,
    createdAt: '2026-03-19',
    author: '텔레그로 운영팀',
  },
];

export const useAdminNoticeDetail = ({
  noticeId = 52,
  notices,
  onBack,
  onGoList,
  onOpenNotice,
}: UseAdminNoticeDetailParams) => {
  const resolvedNotices = notices?.length ? notices : DEFAULT_NOTICE_LIST;

  const notice = useMemo(() => {
    return (
      resolvedNotices.find((item) => item.id === noticeId) ??
      resolvedNotices[0]
    );
  }, [noticeId, resolvedNotices]);

  const currentIndex = useMemo(
    () => resolvedNotices.findIndex((item) => item.id === notice.id),
    [notice.id, resolvedNotices],
  );

  const prevNotice =
    currentIndex < resolvedNotices.length - 1
      ? resolvedNotices[currentIndex + 1]
      : null;
  const nextNotice =
    currentIndex > 0 ? resolvedNotices[currentIndex - 1] : null;

  return {
    notice,
    prevNotice: prevNotice
      ? {
          id: prevNotice.id,
          title: prevNotice.title,
          createdAt: prevNotice.createdAt,
        }
      : null,
    nextNotice: nextNotice
      ? {
          id: nextNotice.id,
          title: nextNotice.title,
          createdAt: nextNotice.createdAt,
        }
      : null,
    handleBack: () => onBack?.(),
    handleGoList: () => onGoList?.(),
    handleOpenNotice: (id: number) => onOpenNotice?.(id),
  };
};
