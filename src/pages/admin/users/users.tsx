import AdminProfileCard from '@components/admin/profile-card/profile-card';
import RoleDonutCard from '@components/admin/user-list/role-donut-card';
import UserCreateDrawer from '@components/admin/user-list/user-create-drawer';
import UserListTable from '@components/admin/user-list/user-list-table';
import ConfirmModal from '@components/common/confirm-modal';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import LoadingPanel from '@components/common/loading-panel';
import SearchBar from '@components/common/search-bar';
import { useEffect, useRef } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ROLE_FILTER_OPTIONS } from './users.constants';
import { useAdminUsersPage } from './use-admin-users-page';

const AdminUsers = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const {
    closeDrawer,
    currentPage,
    deleteTargetUser,
    drawerInitialData,
    drawerMode,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleDeleteRequest,
    handleEdit,
    handleRefresh,
    handleSearch,
    isCreateDrawerOpen,
    isError,
    isFilterOpen,
    isLoading,
    keyword,
    openCreateDrawer,
    roleCounts,
    selectedRoleFilter,
    setAppliedRoleFilter,
    setCurrentPage,
    setIsFilterOpen,
    setKeyword,
    setSelectedRoleFilter,
    totalCount,
    totalPages,
    users,
  } = useAdminUsersPage();

  const selectedRoleLabel =
    ROLE_FILTER_OPTIONS.find((option) => option.value === selectedRoleFilter)?.label ?? '전체';

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!filterRef.current?.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isFilterOpen, setIsFilterOpen]);

  return (
    <div
      ref={pageRef}
      className="flex flex-col gap-[5rem] bg-[#FAFAFA] px-[2rem] py-[2rem] md:px-[5rem] md:py-[3rem] lg:px-[10rem] lg:py-[5rem]"
    >
      <div className="flex gap-8 sm:flex-col md:flex-row md:items-start md:justify-between">
        <AdminProfileCard onMove={() => navigate('/')} />
        <RoleDonutCard className="w-full max-w-[30rem] shrink-0" roleCounts={roleCounts} />
      </div>

      <div className="flex flex-col gap-[3.5rem]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-[2rem]">
            <h1 className="title3 text-gray-900">사용자 관리</h1>
            <button
              type="button"
              onClick={openCreateDrawer}
              aria-label="사용자 등록"
              title="사용자 등록"
              className="flex-row-center h-[4rem] w-[4rem] cursor-pointer rounded-full bg-[#f5f5f5] transition-colors hover:bg-[#E3E3E3]"
            >
              <FiPlus className="text-[2rem] text-gray-600" />
            </button>
          </div>
          <span className="text-[1.6rem] text-[#7A7A7A]">총 {totalCount.toLocaleString()}명</span>
        </div>

        <div ref={filterRef} className="relative">
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
            onRefresh={handleRefresh}
            onFilterClick={() => setIsFilterOpen((prev) => !prev)}
            placeholder="이름, 전화번호, 이메일, 아이디로 검색"
            buttonText="검색하기"
            filterText={selectedRoleLabel}
            size="lg"
          />

          {isFilterOpen ? (
            <div className="absolute top-[calc(100%+1rem)] right-[12.8rem] z-20 min-w-[15rem] rounded-[1.2rem] border border-[#E6E6E6] bg-white p-2 shadow-[0_12px_30px_rgba(17,17,17,0.08)]">
              {ROLE_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedRoleFilter(option.value);
                    setAppliedRoleFilter(option.value === 'ALL' ? undefined : option.value);
                    setCurrentPage(1);
                    setIsFilterOpen(false);
                  }}
                  className={[
                    'flex w-full items-center rounded-[0.8rem] px-4 py-3 text-left text-[1.5rem] transition-colors',
                    option.value === selectedRoleFilter
                      ? 'bg-[#FFF7E0] font-semibold text-[#2B2B2B]'
                      : 'text-[#555555] hover:bg-[#F5F5F5]',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <LoadingPanel />
        ) : isError ? (
          <div className="rounded-[1.6rem] bg-white px-[2.2rem] py-[2rem] text-[1.6rem] text-red-500">
            사용자 목록을 불러오지 못했습니다.
          </div>
        ) : (
          <UserListTable
            users={users}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        )}
      </div>

      <ExploreScrollToTop targetRef={pageRef} />
      <UserCreateDrawer
        open={isCreateDrawerOpen}
        mode={drawerMode}
        initialData={drawerInitialData}
        onClose={closeDrawer}
      />

      {deleteTargetUser ? (
        <ConfirmModal
          message="정말 삭제하시겠습니까?"
          confirmText="삭제"
          cancelText="취소"
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </div>
  );
};

export default AdminUsers;
