import {
  deleteNotice,
  setPopNotice,
  useGetNoticeDetail,
  useGetNotices,
} from '@apis/telegro';
import {
  toastError,
  toastSuccess,
} from '@components/common/toast/toast';
import queryClient from '@libs/query-client';
import { useMemo, useState } from 'react';
import { stripHtmlToText } from '@utils/html';

export type AdminNoticeAttachment = {
  id: number;
  fileName: string;
  fileUrl: string;
};

export type AdminNoticeDetailItem = {
  id: number;
  title: string;
  summary: string;
  content: string;
  views: number;
  createdAt: string;
  relativeLabel?: string;
  author?: string;
  attachments: AdminNoticeAttachment[];
  isPop: boolean;
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
  attachments: [],
  isPop: false,
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

const toSummary = (content?: string) => {
  const plainText = stripHtmlToText(content);

  if (!plainText) {
    return FALLBACK_SUMMARY;
  }

  if (plainText.length <= 120) {
    return plainText;
  }

  return `${plainText.slice(0, 120).trim()}...`;
};

const invalidateNoticeQueries = () =>
  queryClient.invalidateQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      typeof query.queryKey[0] === 'string' &&
      query.queryKey[0].startsWith('/notices'),
  });

export const useAdminNoticeDetail = ({
  noticeId,
  notices,
  onBack,
  onGoList,
  onOpenNotice,
}: UseAdminNoticeDetailParams) => {
  const hasValidNoticeId =
    typeof noticeId === 'number' && Number.isFinite(noticeId);
  const hasInjectedNotices = Boolean(notices?.length);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingPopup, setIsSettingPopup] = useState(false);

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
      attachments: [],
      isPop: false,
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
        attachments: (detail.noticeFiles ?? [])
          .map((file) => ({
            id: file.id ?? 0,
            fileName: file.fileName?.trim() || '첨부파일',
            fileUrl: file.fileUrl?.trim() || '',
          }))
          .filter((file) => Boolean(file.fileUrl)),
        isPop: Boolean(detail.isPop),
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

  const handleDelete = async () => {
    if (!notice.id) return;

    setIsDeleting(true);

    try {
      await deleteNotice(notice.id);
      await invalidateNoticeQueries();
      toastSuccess('공지사항을 삭제했습니다.');
      onGoList?.();
    } catch {
      toastError('공지사항 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetPopup = async () => {
    if (!notice.id || notice.isPop) return;

    setIsSettingPopup(true);

    try {
      await setPopNotice(notice.id);
      await invalidateNoticeQueries();
      await noticeDetailQuery.refetch();
      toastSuccess('공지사항을 팝업 고정했습니다.');
    } catch {
      toastError('공지사항 고정에 실패했습니다.');
    } finally {
      setIsSettingPopup(false);
    }
  };

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
    isDeleting,
    isSettingPopup,
    handleBack: () => onBack?.(),
    handleGoList: () => onGoList?.(),
    handleOpenNotice: (id: number) => onOpenNotice?.(id),
    handleDelete,
    handleSetPopup,
  };
};
