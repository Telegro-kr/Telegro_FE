import AdminProfileCard from '@components/admin/profile-card/profile-card';
import UserListTable, {
} from '@components/admin/user-list/user-list-table';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import useUserList from '@hooks/use-user-list';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 9;

const AdminUsers = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { users, totalPages, totalCount, isLoading, isError } = useUserList({
    page: currentPage - 1,
    size: PAGE_SIZE,
  });

  return (
    <div
      ref={pageRef}
      className="flex flex-col gap-[5rem] bg-[#FAFAFA] px-[2rem] py-[2rem] md:px-[5rem] md:py-[3rem] lg:px-[10rem] lg:py-[5rem]"
    >
      <AdminProfileCard onMove={() => navigate('/')} />

      <div className="flex flex-col gap-[3.5rem]">
        <div className="flex items-end justify-between gap-6">
          <h1 className="title3 text-gray-900">유저 목록</h1>
          <span className="text-[1.6rem] text-[#7A7A7A]">총 {totalCount.toLocaleString()}명</span>
        </div>

        {isError ? (
          <div className="rounded-[1.6rem] bg-white px-[2.2rem] py-[2rem] text-[1.6rem] text-red-500">
            유저 목록을 불러오지 못했습니다.
          </div>
        ) : (
          <UserListTable
            users={users}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
            onRowMenuClick={(user) => navigate(`/admin/users/${user.id}`)}
          />
        )}
      </div>

      <ExploreScrollToTop targetRef={pageRef} />
    </div>
  );
};

export default AdminUsers;
