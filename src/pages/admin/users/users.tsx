import { SignUpUserInfoDtoRole, getUserDetail, type GetUsersFilteredBy, useDeleteUser } from '@apis/telegro';
import AdminProfileCard from '@components/admin/profile-card/profile-card';
import RoleDonutCard from '@components/admin/user-list/role-donut-card';
import UserCreateDrawer, {
  type CreateCompanyForm,
  type UserDrawerInitialData,
} from '@components/admin/user-list/user-create-drawer';
import UserListTable, { type UserRow } from '@components/admin/user-list/user-list-table';
import ConfirmModal from '@components/common/confirm-modal';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import LoadingPanel from '@components/common/loading-panel';
import SearchBar from '@components/common/search-bar';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import useUserList from '@hooks/use-user-list';
import { useEffect, useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 9;

const ROLE_FILTER_OPTIONS: Array<{
  label: string;
  value: GetUsersFilteredBy | 'ALL';
}> = [
  { label: '전체', value: 'ALL' },
  { label: 'MEMBER', value: 'MEMBER' },
  { label: 'DEALER', value: 'DEALER' },
  { label: 'BEST', value: 'BEST' },
  { label: 'BUSINESS', value: 'BUSINESS' },
];

const EMPTY_FORM: CreateCompanyForm = {
  username: '',
  userid: '',
  password: '',
  companyName: '',
  phone: '',
  email: '',
  managerName: '',
  managerPhone: '',
  companyNumber: '',
  companyType: '',
  companyItem: '',
  address: '',
  zipCode: '',
  addressDetail: '',
  companyDescription: '',
};

const ROLE_MAP = {
  MEMBER: SignUpUserInfoDtoRole.MEMBER,
  DEALER: SignUpUserInfoDtoRole.DEALER,
  BEST: SignUpUserInfoDtoRole.BEST,
  BUSINESS: SignUpUserInfoDtoRole.BUSINESS,
  ADMIN: SignUpUserInfoDtoRole.ADMIN,
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getString = (value: unknown) => (typeof value === 'string' ? value : '');

const toRole = (value: unknown) =>
  typeof value === 'string' && value in ROLE_MAP
    ? ROLE_MAP[value as keyof typeof ROLE_MAP]
    : SignUpUserInfoDtoRole.MEMBER;

const buildInitialDataFromUser = (user: UserRow): UserDrawerInitialData => ({
  userId: user.id,
  role: toRole(user.role),
  form: {
    ...EMPTY_FORM,
    username: user.name === '-' ? '' : user.name,
    userid: user.userId === '-' ? '' : user.userId,
    phone: user.phone === '-' ? '' : user.phone,
    email: user.email === '-' ? '' : user.email,
  },
});

const mergeUserDetail = (
  base: UserDrawerInitialData,
  rawData: unknown,
): UserDrawerInitialData => {
  if (!isRecord(rawData)) {
    return base;
  }

  const rawUser = isRecord(rawData.user)
    ? rawData.user
    : isRecord(rawData.data)
      ? rawData.data
      : rawData;
  const rawCompany = isRecord(rawData.company)
    ? rawData.company
    : isRecord(rawUser.company)
      ? rawUser.company
      : {};

  return {
    userId:
      typeof rawUser.id === 'number'
        ? rawUser.id
        : typeof rawData.id === 'number'
          ? rawData.id
          : base.userId,
    role: toRole(rawUser.role ?? rawData.role ?? base.role),
    form: {
      ...base.form,
      username: getString(rawUser.username ?? rawUser.userName) || base.form.username,
      userid: getString(rawUser.userId ?? rawUser.userid) || base.form.userid,
      phone: getString(rawUser.phone) || base.form.phone,
      email: getString(rawUser.email) || base.form.email,
      address: getString(rawUser.address) || base.form.address,
      addressDetail: getString(rawUser.addressDetail) || base.form.addressDetail,
      zipCode: getString(rawUser.zipCode) || base.form.zipCode,
      companyName:
        getString(rawCompany.companyName ?? rawData.companyName) || base.form.companyName,
      managerName:
        getString(rawCompany.managerName ?? rawData.managerName) || base.form.managerName,
      managerPhone:
        getString(rawCompany.managerPhone ?? rawData.managerPhone) || base.form.managerPhone,
      companyNumber:
        getString(rawCompany.companyNumber ?? rawData.companyNumber) ||
        base.form.companyNumber,
      companyType:
        getString(rawCompany.companyType ?? rawData.companyType) || base.form.companyType,
      companyItem:
        getString(rawCompany.companyItem ?? rawData.companyItem) || base.form.companyItem,
      companyDescription:
        getString(rawCompany.companyDescription ?? rawData.companyDescription) ||
        base.form.companyDescription,
    },
  };
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
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

  const selectedRoleLabel =
    ROLE_FILTER_OPTIONS.find((option) => option.value === selectedRoleFilter)?.label ?? '전체';

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
  }, [isFilterOpen]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
          onCancel={() => setDeleteTargetUser(null)}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </div>
  );
};

export default AdminUsers;
