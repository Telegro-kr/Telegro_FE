import {
  useGetUsers,
  type GetUsersFilteredBy,
  type UserDTO,
  type UserDTORole,
} from '@apis/telegro';
import type { UserRole, UserRow } from '@components/admin/user-list/user-list-table';
import { formatPrice } from '@utils/format';
import { useMemo } from 'react';

type UseUserListParams = {
  page: number;
  size?: number;
  filteredBy?: GetUsersFilteredBy;
  searchKeyword?: string;
};

const DEFAULT_PAGE_SIZE = 9;
const FETCH_ALL_SIZE = 10000;

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
  searchKeyword = '',
}: UseUserListParams) => {
  const userQuery = useGetUsers(
    {
      page: 0,
      size: FETCH_ALL_SIZE,
      filteredBy,
    },
    {
      query: {
        staleTime: 60_000,
      },
    },
  );

  const allUsers = useMemo<UserRow[]>(() => {
    return (userQuery.data?.data?.users ?? []).map((user, index) =>
      toUserRow(user, index + 1),
    );
  }, [userQuery.data?.data?.users]);

  const filteredUsers = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return allUsers;
    }

    return allUsers.filter((user) =>
      [user.name, user.phone, user.email, user.userId].some((value) =>
        value.toLowerCase().includes(normalizedKeyword),
      ),
    );
  }, [allUsers, searchKeyword]);

  const users = useMemo<UserRow[]>(() => {
    const startIndex = page * size;

    return filteredUsers.slice(startIndex, startIndex + size);
  }, [filteredUsers, page, size]);

  const totalCount = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / size));
  const roleCounts = useMemo(
    () => ({
      MEMBER: allUsers.filter((user) => user.role === 'MEMBER').length,
      DEALER: allUsers.filter((user) => user.role === 'DEALER').length,
      BEST: allUsers.filter((user) => user.role === 'BEST').length,
      BUSINESS: allUsers.filter((user) => user.role === 'BUSINESS').length,
    }),
    [allUsers],
  );

  return {
    users,
    allUsers,
    roleCounts,
    totalPages,
    totalCount,
    isLoading: userQuery.isLoading,
    isFetching: userQuery.isFetching,
    isError: userQuery.isError,
    refetch: userQuery.refetch,
  };
};

export default useUserList;
