import AdminProfileCard from '@components/admin/profile-card/profile-card';
import UserListTable, {
  type UserRow,
} from '@components/admin/user-list/user-list-table';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_USERS: UserRow[] = [
  {
    id: 1,
    name: '김철수',
    phone: '010-1111-1111',
    email: 'example@naver.com',
    userId: 'AI 기술을 활용해 UX UI 하기',
    joinedAt: '26.03.21',
    totalOrderAmount: '10,000원',
    rewardPoint: '700원',
    role: 'MEMBER',
  },
  {
    id: 2,
    name: '이야옹',
    phone: '010-1111-1111',
    email: 'example@naver.com',
    userId: 'AI 기술을 활용해 UX UI 하기',
    joinedAt: '26.03.21',
    totalOrderAmount: '10,000원',
    rewardPoint: '700원',
    role: 'MEMBER',
  },
  {
    id: 3,
    name: '김고양',
    phone: '010-1111-1111',
    email: 'example@naver.com',
    userId: 'AI 기술을 활용해 UX UI 하기',
    joinedAt: '26.03.21',
    totalOrderAmount: '10,000원',
    rewardPoint: '700원',
    role: 'MEMBER',
  },
  {
    id: 4,
    name: '이라이',
    phone: '010-1111-1111',
    email: 'example@naver.com',
    userId: 'AI 기술을 활용해 UX UI 하기',
    joinedAt: '26.03.21',
    totalOrderAmount: '10,000원',
    rewardPoint: '700원',
    role: 'DEALER',
  },
  {
    id: 5,
    name: '김아지',
    phone: '010-1111-1111',
    email: 'example@naver.com',
    userId: 'AI 기술을 활용해 UX UI 하기',
    joinedAt: '26.03.21',
    totalOrderAmount: '10,000원',
    rewardPoint: '700원',
    role: 'DEALER',
  },
  {
    id: 6,
    name: '이야옹',
    phone: '010-1111-1111',
    email: 'example@naver.com',
    userId: 'AI 기술을 활용해 UX UI 하기',
    joinedAt: '26.03.21',
    totalOrderAmount: '10,000원',
    rewardPoint: '700원',
    role: 'MEMBER',
  },
  {
    id: 7,
    name: '김고양',
    phone: '010-1111-1111',
    email: 'example@naver.com',
    userId: 'AWS Korea와 함께하는 클라우드',
    joinedAt: '26.03.21',
    totalOrderAmount: '10,000원',
    rewardPoint: '700원',
    role: 'BEST',
  },
  {
    id: 8,
    name: '김고양',
    phone: '010-1111-1111',
    email: 'example@naver.com',
    userId: 'AWS Korea와 함께하는 클라우드',
    joinedAt: '26.03.21',
    totalOrderAmount: '10,000원',
    rewardPoint: '700원',
    role: 'BEST',
  },
  {
    id: 9,
    name: '김고양',
    phone: '010-1111-1111',
    email: 'example@naver.com',
    userId: 'AWS Korea와 함께하는 클라우드',
    joinedAt: '26.03.21',
    totalOrderAmount: '10,000원',
    rewardPoint: '700원',
    role: 'BUSINESS',
  },
  {
    id: 10,
    name: '박프론트',
    phone: '010-2222-2222',
    email: 'front@naver.com',
    userId: 'React UI Master',
    joinedAt: '26.03.20',
    totalOrderAmount: '20,000원',
    rewardPoint: '1,400원',
    role: 'MEMBER',
  },
  {
    id: 11,
    name: '최디자인',
    phone: '010-3333-3333',
    email: 'design@naver.com',
    userId: 'Design System Builder',
    joinedAt: '26.03.19',
    totalOrderAmount: '15,000원',
    rewardPoint: '900원',
    role: 'DEALER',
  },
  {
    id: 12,
    name: '오백엔드',
    phone: '010-4444-4444',
    email: 'backend@naver.com',
    userId: 'API Engineering Team',
    joinedAt: '26.03.18',
    totalOrderAmount: '32,000원',
    rewardPoint: '2,100원',
    role: 'BEST',
  },
  {
    id: 13,
    name: '정비즈',
    phone: '010-5555-5555',
    email: 'biz@naver.com',
    userId: 'Business Cloud Account',
    joinedAt: '26.03.17',
    totalOrderAmount: '42,000원',
    rewardPoint: '2,700원',
    role: 'BUSINESS',
  },
  {
    id: 14,
    name: '한세일즈',
    phone: '010-6666-6666',
    email: 'sales@naver.com',
    userId: 'Sales Partner Dealer',
    joinedAt: '26.03.16',
    totalOrderAmount: '18,000원',
    rewardPoint: '1,100원',
    role: 'DEALER',
  },
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pageRef}
      className="flex flex-col gap-[5rem] bg-[#FAFAFA] px-[2rem] py-[2rem] md:px-[5rem] md:py-[3rem] lg:px-[10rem] lg:py-[5rem]"
    >
      <AdminProfileCard onMove={() => navigate('/')} />

      <div className="flex flex-col gap-[3.5rem]">
        <h1 className="title3 text-gray-900">유저 목록</h1>
        <UserListTable
          users={MOCK_USERS}
          onRowMenuClick={(user) => navigate(`/admin/users/${user.id}`)}
        />
      </div>

      <ExploreScrollToTop targetRef={pageRef} />
    </div>
  );
};

export default AdminUsers;
