import { useMemo } from 'react';
import { useGetNotices } from '@apis/telegro';
import { stripHtmlToText } from '@utils/html';

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
  pageSize?: number;
  searchKeyword?: string;
};

const DEFAULT_PAGE_SIZE = 2;
const FALLBACK_PREVIEW =
  '공지 상세 페이지에서 자세한 내용을 확인할 수 있습니다.';

type NoticeListItemWithContext = {
  context?: string | null;
};

const formatNoticeDate = (value?: string) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

export function useNoticeSection({
  notices,
  onClickAll,
  pageSize = DEFAULT_PAGE_SIZE,
  searchKeyword = '',
}: UseNoticeSectionParams = {}) {
  const hasInjectedNotices = Boolean(notices?.length);
  const noticeQuery = useGetNotices(
    { page: 0, size: pageSize },
    {
      query: {
        staleTime: 60_000,
      },
    },
  );

  const resolvedNotices = useMemo(() => {
    if (notices?.length) {
      return notices;
    }

    return (noticeQuery.data?.data?.notices ?? []).map((notice) => {
      const plainTextPreview = stripHtmlToText(
        (notice as typeof notice & NoticeListItemWithContext).context ?? '',
      );

      return {
        id: notice.id ?? 0,
        title:
          notice.noticeTitle?.trim() ||
          '\uC81C\uBAA9 \uC5C6\uB294 \uACF5\uC9C0\uC0AC\uD56D',
        preview: plainTextPreview || FALLBACK_PREVIEW,
        views: notice.viewCount ?? 0,
        dateLabel: formatNoticeDate(notice.noticeCreateDate),
      };
    });
  }, [noticeQuery.data?.data?.notices, notices]);

  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const filteredNotices = useMemo(() => {
    if (!normalizedKeyword) {
      return resolvedNotices;
    }

    return resolvedNotices.filter((notice) =>
      notice.title.toLowerCase().includes(normalizedKeyword),
    );
  }, [normalizedKeyword, resolvedNotices]);

  return {
    title: '\uACF5\uC9C0\uC0AC\uD56D',
    actionLabel:
      '\uC804\uCCB4 \uACF5\uC9C0\uC0AC\uD56D \uD655\uC778\uD558\uAE30',
    notices: filteredNotices,
    isLoading: hasInjectedNotices ? false : noticeQuery.isLoading,
    isError: hasInjectedNotices ? false : noticeQuery.isError,
    handleClickAll: () => {
      onClickAll?.();
    },
  };
}
