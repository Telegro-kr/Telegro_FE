import { useEffect, useMemo, useRef, useState } from 'react';

export type UserRole = 'MEMBER' | 'DEALER' | 'BEST' | 'BUSINESS' | 'ADMIN';

export type UserRow = {
  id: number;
  name: string;
  phone: string;
  email: string;
  userId: string;
  joinedAt: string;
  totalOrderAmount: string;
  rewardPoint: string;
  role: UserRole;
};

type UserListTableProps = {
  users: UserRow[];
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onEdit?: (user: UserRow) => void;
  onDelete?: (user: UserRow) => void;
  onPageChange?: (page: number) => void;
};

const ROLE_COLOR_MAP: Record<UserRole, string> = {
  MEMBER: '#FFE96E',
  DEALER: '#FCBB60',
  BEST: '#DDA9FF',
  BUSINESS: '#91B6FF',
  ADMIN: '#B8B8B8',
};

function KebabButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#828282] transition hover:bg-slate-100"
      aria-label="사용자 메뉴 열기"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="10" cy="4" r="1.6" fill="currentColor" />
        <circle cx="10" cy="10" r="1.6" fill="currentColor" />
        <circle cx="10" cy="16" r="1.6" fill="currentColor" />
      </svg>
    </button>
  );
}

function PaginationArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        'flex h-[21px] w-[21px] items-center justify-center rounded-full transition',
        disabled
          ? 'cursor-not-allowed bg-[#E9E9E9] text-[#C9C9C9]'
          : 'bg-[#E9E9E9] text-[#9A9A9A] hover:brightness-95',
      ].join(' ')}
      aria-label={direction === 'prev' ? '이전 페이지' : '다음 페이지'}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        {direction === 'prev' ? (
          <path
            d="M9.5 3.5L5.5 8L9.5 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6.5 3.5L10.5 8L6.5 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

function getPaginationRange(
  currentPage: number,
  totalPages: number,
): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ];
}

const UserListTable = ({
  users,
  currentPage,
  totalPages,
  isLoading = false,
  onEdit,
  onDelete,
  onPageChange,
}: UserListTableProps) => {
  const [openMenuUserId, setOpenMenuUserId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openMenuUserId === null) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpenMenuUserId(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [openMenuUserId]);

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const goToPage = (page: number) => {
    onPageChange?.(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <section className="w-full rounded-[20px] bg-[#FAFAFA] px-3 py-4 md:px-4 md:py-5">
      <div className="w-full">
        <div className="overflow-x-auto">
          <div className="min-w-[1040px]">
            <div className="grid grid-cols-[92px_160px_210px_minmax(240px,1fr)_98px_108px_88px_44px] items-center px-[18px] pb-[14px] text-[18px] font-medium text-[#505050]">
              <div className="text-left">이름</div>
              <div className="text-left">전화번호</div>
              <div className="text-left">이메일</div>
              <div className="pl-[1rem] text-left">아이디</div>
              <div className="text-left">가입일</div>
              <div className="text-left">총 주문액</div>
              <div className="text-left">적립금</div>
              <div />
            </div>

            <div className="flex flex-col gap-[14px]">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="relative grid h-[58px] grid-cols-[92px_160px_210px_minmax(240px,1fr)_98px_108px_88px_44px] items-center rounded-[8px] bg-white px-[18px]"
                >
                  <div
                    className="absolute top-0 bottom-0 left-0 w-[8px] rounded-l-[8px]"
                    style={{ backgroundColor: ROLE_COLOR_MAP[user.role] }}
                    aria-hidden="true"
                  />

                  <div className="truncate pl-[1px] text-[16px] font-normal text-[#626262]">
                    {user.name}
                  </div>
                  <div className="truncate text-[16px] font-normal text-[#626262]">
                    {user.phone}
                  </div>
                  <div className="truncate text-[16px] font-normal text-[#626262]">
                    {user.email}
                  </div>
                  <div className="truncate px-4 text-left text-[16px] font-normal text-[#626262]">
                    {user.userId}
                  </div>
                  <div className="text-left text-[16px] font-normal text-[#828282]">
                    {user.joinedAt}
                  </div>
                  <div className="text-left text-[16px] font-normal text-[#828282]">
                    {user.totalOrderAmount}
                  </div>
                  <div className="text-left text-[16px] font-normal text-[#828282]">
                    {user.rewardPoint}
                  </div>
                  <div
                    ref={openMenuUserId === user.id ? menuRef : undefined}
                    className="relative flex justify-center"
                  >
                    <KebabButton
                      onClick={() =>
                        setOpenMenuUserId((prev) =>
                          prev === user.id ? null : user.id,
                        )
                      }
                    />

                    {openMenuUserId === user.id ? (
                      <div className="absolute top-[calc(100%+8px)] right-0 z-20 min-w-[120px] rounded-[12px] border border-[#E6E6E6] bg-white p-1 shadow-[0_12px_30px_rgba(17,17,17,0.08)]">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuUserId(null);
                            onEdit?.(user);
                          }}
                          className="flex w-full cursor-pointer items-center rounded-[8px] px-4 py-3 text-left text-[15px] text-[#444444] transition hover:bg-[#F5F5F5]"
                        >
                          수정하기
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuUserId(null);
                            onDelete?.(user);
                          }}
                          className="flex w-full cursor-pointer items-center rounded-[8px] px-4 py-3 text-left text-[15px] text-[#D14B4B] transition hover:bg-[#FFF3F3]"
                        >
                          삭제하기
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {!isLoading && users.length === 0 ? (
                <div className="flex h-[160px] items-center justify-center rounded-[8px] bg-white text-[16px] text-[#8A8A8A]">
                  표시할 유저가 없습니다.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-[17px]">
          <PaginationArrow
            direction="prev"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          />

          <div className="flex items-center gap-[17px] text-[16px]">
            {paginationRange.map((item, index) =>
              item === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className="text-[#B5B5B5]">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => goToPage(item)}
                  className={[
                    'transition',
                    currentPage === item
                      ? 'font-medium text-[#2B2B2B]'
                      : 'font-normal text-[#B5B5B5] hover:text-[#707070]',
                  ].join(' ')}
                  aria-current={currentPage === item ? 'page' : undefined}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          <PaginationArrow
            direction="next"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          />
        </div>
      </div>
    </section>
  );
};

export default UserListTable;
