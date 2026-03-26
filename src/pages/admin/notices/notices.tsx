import AdminProfileCard from '@components/admin/profile-card/profile-card';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import LoadingPanel from '@components/common/loading-panel';
import SearchBar from '@components/common/search-bar';
import NoticeCard from '@components/notice/notice-card';
import { useNoticeSection } from '@hooks/use-notice-section';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNotices = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { notices, isLoading, isError } = useNoticeSection({
    pageSize: 100,
    searchKeyword,
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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="title3 text-gray-900">공지사항</h1>
          <button
            type="button"
            onClick={() => navigate('/admin/notices/create')}
            className="inline-flex h-[5.2rem] items-center justify-center rounded-[1.5rem] border border-[#FFE2C0] bg-[linear-gradient(135deg,#FF9B2F_0%,#FFB652_100%)] px-[2rem] text-[1.5rem] font-semibold tracking-[-0.03em] text-white shadow-[0_16px_34px_rgba(255,155,47,0.24)] transition hover:-translate-y-0.5"
          >
            공지 등록
          </button>
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
