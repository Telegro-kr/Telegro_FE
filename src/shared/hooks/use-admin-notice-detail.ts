import { useGetNoticeDetail, useGetNotices } from '@apis/telegro';
import { useMemo } from 'react';

export type AdminNoticeDetailItem = {
  id: number;
  title: string;
  summary: string;
  content: string;
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

const DEFAULT_NOTICE: AdminNoticeDetailItem = {
  id: 0,
  title: '공지사항을 찾을 수 없습니다.',
  summary: '',
  content: '',
  views: 0,
  createdAt: '-',
};

const FALLBACK_SUMMARY = '공지 상세 페이지에서 본문을 확인할 수 있습니다.';

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

const stripHtml = (value?: string) =>
  (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toSummary = (content?: string) => {
  const plainText = stripHtml(content);

  if (!plainText) {
    return FALLBACK_SUMMARY;
  }

  if (plainText.length <= 120) {
    return plainText;
  }

  return `${plainText.slice(0, 120).trim()}...`;
};

export const useAdminNoticeDetail = ({
  noticeId,
  notices,
  onBack,
  onGoList,
  onOpenNotice,
}: UseAdminNoticeDetailParams) => {
  const hasValidNoticeId = typeof noticeId === 'number' && Number.isFinite(noticeId);
  const hasInjectedNotices = Boolean(notices?.length);

  const noticeDetailQuery = useGetNoticeDetail(noticeId ?? 0, {
    query: {
      enabled: hasValidNoticeId,
      staleTime: 60_000,
    },
  });

  const noticeListQuery = useGetNotices(
    { page: 0, size: 100 },
    {
      query: {
        enabled: !hasInjectedNotices,
        staleTime: 60_000,
      },
    },
  );

  const resolvedNotices = useMemo(() => {
    if (notices?.length) {
      return notices;
    }

    return (noticeListQuery.data?.data?.notices ?? []).map((notice) => ({
      id: notice.id ?? 0,
      title: notice.noticeTitle?.trim() || '제목 없는 공지사항',
      summary:
        notice.noticeFileName?.trim() ||
        notice.noticeAuthor?.trim() ||
        FALLBACK_SUMMARY,
      content: '',
      views: notice.viewCount ?? 0,
      createdAt: formatNoticeDate(notice.noticeCreateDate),
      author: notice.noticeAuthor?.trim() || '',
    }));
  }, [noticeListQuery.data?.data?.notices, notices]);

  const notice = useMemo(() => {
    const detail = noticeDetailQuery.data?.data;

    if (detail) {
      return {
        id: detail.id ?? noticeId ?? 0,
        title: detail.noticeTitle?.trim() || '제목 없는 공지사항',
        summary: toSummary(detail.noticeContent),
        content: detail.noticeContent?.trim() || '',
        views: detail.viewCount ?? 0,
        createdAt: formatNoticeDate(detail.noticeCreateDate),
        author: detail.noticeAuthor?.trim() || '',
      };
    }

    if (hasValidNoticeId) {
      return resolvedNotices.find((item) => item.id === noticeId) ?? DEFAULT_NOTICE;
    }

    return DEFAULT_NOTICE;
  }, [hasValidNoticeId, noticeDetailQuery.data?.data, noticeId, resolvedNotices]);

  const currentIndex = useMemo(
    () => resolvedNotices.findIndex((item) => item.id === notice.id),
    [notice.id, resolvedNotices],
  );

  const prevNotice =
    currentIndex >= 0 && currentIndex < resolvedNotices.length - 1
      ? resolvedNotices[currentIndex + 1]
      : null;
  const nextNotice = currentIndex > 0 ? resolvedNotices[currentIndex - 1] : null;

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
    isLoading: noticeDetailQuery.isLoading,
    isError: noticeDetailQuery.isError || !hasValidNoticeId,
    handleBack: () => onBack?.(),
    handleGoList: () => onGoList?.(),
    handleOpenNotice: (id: number) => onOpenNotice?.(id),
  };
};
