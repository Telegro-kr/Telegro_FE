import { useMemo } from 'react';

export type NoticeItem = {
  id: number;
  title: string;
  preview: string;
  views: number;
  dateLabel: string;
};

type UseNoticeSectionParams = {
  notices?: NoticeItem[];
  onClickAll?: () => void;
};

const DEFAULT_NOTICES: NoticeItem[] = [
  {
    id: 52,
    title: '공지사항 타이틀이 들어갑니다.',
    preview:
      '이 부분은 내용 미리보기가 들어갑니다. 이 부분은 내용 미리보기가 들어갑니다. 이 부분은 내용 미리보기가 들어갑니다. 이 부분은 내용 미리보기가 들어갑니다. 이 부분은 내용 미리보기가 들어갑니다. 이 부분은 내용 미리보기가 들어갑니다. 이 부분은 내용 미리보기가 들어갑니다. 이 부분은 내용 미리보기가 들어갑니다.',
    views: 99,
    dateLabel: '22시간 전',
  },
  {
    id: 51,
    title: '공지사항 타이틀이 들어갑니다.',
    preview:
      '이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다. 이건 세 줄까지만 보입니다.',
    views: 99,
    dateLabel: '2026.03.27',
  },
];

export function useNoticeSection({
  notices,
  onClickAll,
}: UseNoticeSectionParams = {}) {
  const resolvedNotices = useMemo(() => {
    return notices?.length ? notices : DEFAULT_NOTICES;
  }, [notices]);

  return {
    title: '공지사항',
    actionLabel: '전체 공지사항 확인하기',
    notices: resolvedNotices,
    handleClickAll: () => {
      onClickAll?.();
    },
  };
}
