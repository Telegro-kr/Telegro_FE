import {
  useGetUsers,
  type GetUsersFilteredBy,
  type UserDTO,
  type UserDTORole,
} from '@apis/telegro';
import type { UserRole, UserRow } from '@components/admin/user-list/user-list-table';
import { formatNumber } from '@utils/format';
import { useMemo } from 'react';

type UseUserListParams = {
  page: number;
  size?: number;
  filteredBy?: GetUsersFilteredBy;
};

const DEFAULT_PAGE_SIZE = 9;

const formatPrice = (value?: number | null) => {
  if (value === undefined || value === null) {
    return '-';
  }

  return `${formatNumber(value)}원`;
};

const formatJoinedAt = (value?: string) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

const normalizeRole = (role?: UserDTORole): UserRole => {
  switch (role) {
    case 'DEALER':
    case 'BEST':
    case 'BUSINESS':
    case 'ADMIN':
      return role;
    case 'MEMBER':
    default:
      return 'MEMBER';
  }
};

const toUserRow = (user: UserDTO, fallbackIndex: number): UserRow => ({
  id: user.id ?? fallbackIndex,
  name: user.userName?.trim() || '-',
  phone: user.phone?.trim() || '-',
  email: user.email?.trim() || '-',
  userId: user.userId?.trim() || '-',
  joinedAt: formatJoinedAt(user.createdDate),
  totalOrderAmount: formatPrice(user.totalPrice),
  rewardPoint: formatPrice(user.point),
  role: normalizeRole(user.role),
});

export const useUserList = ({
  page,
  size = DEFAULT_PAGE_SIZE,
  filteredBy,
}: UseUserListParams) => {
  const userQuery = useGetUsers(
    {
      page,
      size,
      filteredBy,
    },
    {
      query: {
        staleTime: 60_000,
      },
    },
  );

  const users = useMemo<UserRow[]>(() => {
    return (userQuery.data?.data?.users ?? []).map((user, index) =>
      toUserRow(user, page * size + index + 1),
    );
  }, [page, size, userQuery.data?.data?.users]);

  return {
    users,
    totalPages: Math.max(1, userQuery.data?.data?.totalPage ?? 1),
    totalCount: userQuery.data?.data?.totalElement ?? users.length,
    isLoading: userQuery.isLoading,
    isFetching: userQuery.isFetching,
    isError: userQuery.isError,
    refetch: userQuery.refetch,
  };
};

export default useUserList;
