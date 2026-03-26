import { getUserDetail, type GetUsersFilteredBy, useDeleteUser } from '@apis/telegro';
import type { UserDrawerInitialData } from '@components/admin/user-list/user-drawer.types';
import type { UserRow } from '@components/admin/user-list/user-list-table';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import useUserList from '@hooks/use-user-list';
import { useEffect, useState } from 'react';
import { PAGE_SIZE } from './users.constants';
import { buildInitialDataFromUser, mergeUserDetail } from './users.utils';

export const useAdminUsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<GetUsersFilteredBy | 'ALL'>('ALL');
  const [appliedRoleFilter, setAppliedRoleFilter] = useState<GetUsersFilteredBy>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [drawerInitialData, setDrawerInitialData] = useState<UserDrawerInitialData | null>(null);
  const [deleteTargetUser, setDeleteTargetUser] = useState<UserRow | null>(null);

  const { roleCounts } = useUserList({
    page: 0,
    size: PAGE_SIZE,
  });

  const { users, totalPages, totalCount, isLoading, isError, refetch } = useUserList({
    page: currentPage - 1,
    size: PAGE_SIZE,
    filteredBy: appliedRoleFilter,
    searchKeyword: appliedSearchKeyword,
  });

  const deleteUserMutation = useDeleteUser();

  const openCreateDrawer = () => {
    setDrawerMode('create');
    setDrawerInitialData(null);
    setIsCreateDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsCreateDrawerOpen(false);
    setDrawerInitialData(null);
    setDrawerMode('create');
  };

  const handleSearch = (value: string) => {
    setAppliedSearchKeyword(value);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleRefresh = () => {
    setKeyword('');
    setAppliedSearchKeyword('');
    setSelectedRoleFilter('ALL');
    setAppliedRoleFilter(undefined);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleEdit = async (user: UserRow) => {
    const fallbackData = buildInitialDataFromUser(user);

    setDrawerMode('edit');
    setDrawerInitialData(fallbackData);
    setIsCreateDrawerOpen(true);

    try {
      const response = await getUserDetail(user.id);
      setDrawerInitialData(mergeUserDetail(fallbackData, response?.data));
    } catch {
      toastError('사용자 상세 정보를 모두 불러오지 못해 기본 정보만 표시합니다.');
    }
  };

  const handleDeleteRequest = (user: UserRow) => {
    setDeleteTargetUser(user);
  };

  const handleDeleteCancel = () => {
    setDeleteTargetUser(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetUser) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync({ userId: deleteTargetUser.id });
      setDeleteTargetUser(null);
      toastSuccess('사용자를 삭제했습니다.');

      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
        return;
      }

      await refetch();
    } catch {
      setDeleteTargetUser(null);
      toastError('사용자 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
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
    closeDrawer,
    roleCounts,
    selectedRoleFilter,
    setCurrentPage,
    setIsFilterOpen,
    setKeyword,
    setSelectedRoleFilter,
    setAppliedRoleFilter,
    totalCount,
    totalPages,
    users,
  };
};
