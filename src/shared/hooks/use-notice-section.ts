import { useMemo } from 'react';
import { useGetNotices } from '@apis/telegro';

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

const FALLBACK_PREVIEW =
  '\uACF5\uC9C0 \uC0C1\uC138 \uD398\uC774\uC9C0\uC5D0\uC11C \uBCF8\uBB38\uC744 \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.';

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
}: UseNoticeSectionParams = {}) {
  const hasInjectedNotices = Boolean(notices?.length);
  const noticeQuery = useGetNotices(
    { page: 0, size: 2 },
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

    return (noticeQuery.data?.data?.notices ?? []).map((notice) => ({
      id: notice.id ?? 0,
      title:
        notice.noticeTitle?.trim() ||
        '\uC81C\uBAA9 \uC5C6\uB294 \uACF5\uC9C0\uC0AC\uD56D',
      preview:
        notice.noticeFileName?.trim() ||
        notice.noticeAuthor?.trim() ||
        FALLBACK_PREVIEW,
      views: notice.viewCount ?? 0,
      dateLabel: formatNoticeDate(notice.noticeCreateDate),
    }));
  }, [noticeQuery.data?.data?.notices, notices]);

  return {
    title: '\uACF5\uC9C0\uC0AC\uD56D',
    actionLabel:
      '\uC804\uCCB4 \uACF5\uC9C0\uC0AC\uD56D \uD655\uC778\uD558\uAE30',
    notices: resolvedNotices,
    isLoading: hasInjectedNotices ? false : noticeQuery.isLoading,
    isError: hasInjectedNotices ? false : noticeQuery.isError,
    handleClickAll: () => {
      onClickAll?.();
    },
  };
}
