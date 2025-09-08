import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AdminGuard from '@routes/admin-guard';
import AuthGuard from '@routes/auth-guard';

// 레이아웃 (각 레이아웃에는 반드시 <Outlet /> 포함)
const PublicLayout = lazy(() => import('@layouts/public-layout'));
const MemberLayout = lazy(() => import('@layouts/member-layout'));
const AdminLayout = lazy(() => import('@layouts/admin-layout'));

// Public
const PublicHome = lazy(() => import('@pages/public/home'));
const PublicProducts = lazy(() => import('@pages/public/products/products'));
const PublicProdDet = lazy(
  () => import('@pages/public/products/product-detail'),
);
const Notices = lazy(() => import('@pages/public/notices/notices'));
const NoticeDetail = lazy(() => import('@pages/public/notices/notice-detail'));
const Login = lazy(() => import('@pages/auth/login'));
const Signup = lazy(() => import('@pages/auth/signup'));
const Forbidden = lazy(() => import('@pages/errors/forbidden'));
const NotFound = lazy(() => import('@pages/errors/not-found'));

// Member (로그인 필요)
const Cart = lazy(() => import('@pages/app/cart/cart'));
const Checkout = lazy(() => import('@pages/app/checkout/checkout'));
const CheckoutDone = lazy(() => import('@pages/app/checkout/complete'));
const Orders = lazy(() => import('@pages/app/orders/orders'));
const OrderDetail = lazy(() => import('@pages/app/orders/order-detail'));
const MyPage = lazy(() => import('@pages/app/my/my'));

// Admin (관리자 권한 필요)
const AdminDashboard = lazy(() => import('@pages/admin/dashboard/dashboard'));
const AdminUsers = lazy(() => import('@pages/admin/users/users'));
const AdminUserDet = lazy(() => import('@pages/admin/users/user-detail'));
const AdminUserNew = lazy(() => import('@pages/admin/users/create'));
const AdminProductNew = lazy(() => import('@pages/admin/products/create'));

export const router = createBrowserRouter([
  // 공개 영역
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <PublicHome /> },
      { path: 'products', element: <PublicProducts /> },
      { path: 'products/:productId', element: <PublicProdDet /> },
      { path: 'notices', element: <Notices /> },
      { path: 'notices/:noticeId', element: <NoticeDetail /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forbidden', element: <Forbidden /> },
    ],
  },

  // 회원(로그인 필요) 영역
  {
    path: '/app',
    element: <AuthGuard />,
    children: [
      {
        element: <MemberLayout />,
        children: [
          { path: 'cart', element: <Cart /> },
          { path: 'checkout', element: <Checkout /> },
          { path: 'checkout/complete', element: <CheckoutDone /> },
          { path: 'orders', element: <Orders /> },
          { path: 'orders/:orderId', element: <OrderDetail /> },
          { path: 'my', element: <MyPage /> },
        ],
      },
    ],
  },

  // 관리자 전용 영역
  {
    path: '/admin',
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'users/create', element: <AdminUserNew /> },
          { path: 'users/:userId', element: <AdminUserDet /> },
          { path: 'products/create', element: <AdminProductNew /> },
        ],
      },
    ],
  },

  { path: '*', element: <NotFound /> },
]);
