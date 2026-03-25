import AdminProfileCard from '@components/admin/profile-card/profile-card';
import UserListTable, {
  type UserRow,
} from '@components/admin/user-list/user-list-table';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import { useDeleteUser } from '@apis/telegro';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import useUserList from '@hooks/use-user-list';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 9;

const AdminUsers = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { users, totalPages, totalCount, isLoading, isError, refetch } = useUserList({
    page: currentPage - 1,
    size: PAGE_SIZE,
  });
  const deleteUserMutation = useDeleteUser();

  const handleEdit = (user: UserRow) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleDelete = async (user: UserRow) => {
    const isConfirmed = window.confirm(`${user.name} 유저를 삭제하시겠습니까?`);

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync({ userId: user.id });
      toastSuccess('유저를 삭제했습니다.');

      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
        return;
      }

      await refetch();
    } catch {
      toastError('유저 삭제에 실패했습니다.');
    }
  };

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
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ExploreScrollToTop targetRef={pageRef} />
    </div>
  );
};

export default AdminUsers;
