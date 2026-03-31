import AdminProfileCard from '@components/admin/profile-card/profile-card';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import LoadingPanel from '@components/common/loading-panel';
import SearchBar from '@components/common/search-bar';
import NoticeCard from '@components/notice/notice-card';
import { useNoticeSection } from '@hooks/use-notice-section';
import { useInfiniteScrollTrigger } from '@hooks/use-infinite-scroll-trigger';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const AdminNotices = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { notices, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useNoticeSection({
    pageSize: 10,
    searchKeyword,
  });

  const loadMoreRef = useInfiniteScrollTrigger({
    enabled: hasNextPage && !isFetchingNextPage,
    onLoadMore: () => fetchNextPage(),
  });

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleRefresh = () => {
    setKeyword('');
    setSearchKeyword('');
  };

  return (
    <div
      ref={pageRef}
      className="flex flex-col gap-[5rem] bg-[#FAFAFA] px-[2rem] py-[2rem] md:px-[5rem] md:py-[3rem] lg:px-[10rem] lg:py-[5rem]"
    >
      <AdminProfileCard onMove={() => navigate('/')} />

      <div className="flex flex-col gap-[3.5rem]">
        <div className="flex items-center gap-[2rem]">
          <h1 className="title3 text-gray-900">공지사항</h1>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/notices/create')}
              aria-label="상공지 등록"
              title="공지 등록"
              className="flex-row-center h-[4rem] w-[4rem] cursor-pointer rounded-full bg-[#f5f5f5] transition-colors hover:bg-[#E3E3E3]"
            >
              <FiPlus className="text-[2rem] text-gray-600" />
            </button>
          </div>
        </div>

        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          placeholder="찾으시는 공지사항 제목을 입력해 주세요"
          buttonText="검색하기"
          size="lg"
        />
      </div>

      {isLoading ? (
        <LoadingPanel className="rounded-2xl" />
      ) : isError ? (
        <div className="rounded-2xl bg-white px-[2.2rem] py-[2rem] text-[1.6rem] text-red-500">
          공지사항을 불러오지 못했습니다.
        </div>
      ) : notices.length ? (
        <div className="flex flex-col gap-4">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onClick={(noticeId) => {
                navigate(`/admin/notices/${noticeId}`);
              }}
            />
          ))}
          {(hasNextPage || isFetchingNextPage) ? (
            <div ref={loadMoreRef}>
              {isFetchingNextPage ? (
                <LoadingPanel className="min-h-0 rounded-2xl py-[2rem]" size={72} />
              ) : (
                <div className="h-[1px] w-full" />
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl bg-white px-[2.2rem] py-[2rem] text-[1.6rem] text-gray-500">
          표시할 공지사항이 없습니다.
        </div>
      )}

      <ExploreScrollToTop targetRef={pageRef} />
    </div>
  );
};

export default AdminNotices;
