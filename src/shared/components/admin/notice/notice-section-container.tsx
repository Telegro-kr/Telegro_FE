'use client';

import { useNoticeSection, type NoticeItem } from '@hooks/use-notice-section';
import NoticeSectionView from './notice-section-view';

type NoticeSectionContainerProps = {
  notices?: NoticeItem[];
  onClickAll?: () => void;
  onClickNotice?: (noticeId: number) => void;
};

export default function NoticeSectionContainer({
  notices,
  onClickAll,
  onClickNotice,
}: NoticeSectionContainerProps) {
  const {
    title,
    actionLabel,
    notices: resolvedNotices,
    handleClickAll,
  } = useNoticeSection({
    notices,
    onClickAll,
  });

  return (
    <NoticeSectionView
      title={title}
      actionLabel={actionLabel}
      notices={resolvedNotices}
      onClickAll={handleClickAll}
      onClickNotice={onClickNotice}
    />
  );
}
