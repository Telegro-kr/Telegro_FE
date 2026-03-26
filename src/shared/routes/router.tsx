import AdminGuard from '@routes/admin-guard';
import AuthGuard from '@routes/auth-guard';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const PublicLayout = lazy(() => import('@layouts/public-layout'));
const MemberLayout = lazy(() => import('@layouts/member-layout'));
const AdminLayout = lazy(() => import('@layouts/admin-layout'));

const PublicHome = lazy(() => import('@pages/public/home'));
const PublicProducts = lazy(() => import('@pages/public/products/products'));
const PublicProdDet = lazy(
  () => import('@pages/public/products/product-detail'),
);
const Notices = lazy(() => import('@pages/public/notices/notices'));
const NoticeDetail = lazy(() => import('@pages/public/notices/notice-detail'));
const Login = lazy(() => import('@pages/auth/login'));
const ErrorPage = lazy(() => import('@pages/errors/error'));
const NotFound = lazy(() => import('@pages/errors/not-found'));

const Cart = lazy(() => import('@pages/app/cart/cart'));
const Checkout = lazy(() => import('@pages/app/checkout/checkout'));
const CheckoutDone = lazy(() => import('@pages/app/checkout/complete'));
const Orders = lazy(() => import('@pages/app/orders/orders'));
const OrderDetail = lazy(() => import('@pages/app/orders/order-detail'));
const MyPage = lazy(() => import('@pages/app/my/my'));
const MyEditPage = lazy(() => import('@pages/app/my/edit'));

const AdminDashboard = lazy(() => import('@pages/admin/dashboard/dashboard'));
const AdminUsers = lazy(() => import('@pages/admin/users/users'));
const AdminUserDet = lazy(() => import('@pages/admin/users/user-detail'));
const AdminUserNew = lazy(() => import('@pages/admin/users/create'));
const AdminProductNew = lazy(() => import('@pages/admin/products/create'));
const AdminProducts = lazy(() => import('@pages/admin/products/products'));
const AdminProductDetail = lazy(() => import('@pages/admin/products/detail'));
const AdminOrders = lazy(() => import('@pages/admin/orders/orders'));
const AdminNoticesNew = lazy(() => import('@pages/admin/notices/create'));
const AdminNotices = lazy(() => import('@pages/admin/notices/notices'));
const AdminNoticeDetail = lazy(
  () => import('@pages/admin/notices/notice-detail'),
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <PublicHome /> },
      { path: 'products', element: <PublicProducts /> },
      { path: 'products/:productId', element: <PublicProdDet /> },
      { path: 'notices', element: <Notices /> },
      { path: 'notices/:noticeId', element: <NoticeDetail /> },
      { path: 'login', element: <Login /> },
      { path: 'error', element: <ErrorPage /> },
    ],
  },
  {
    path: '/app',
    element: <AuthGuard />,
    errorElement: <ErrorPage />,
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
          { path: 'my/edit', element: <MyEditPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminGuard />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'users/create', element: <AdminUserNew /> },
          { path: 'users/:userId', element: <AdminUserDet /> },
          { path: 'products/create', element: <AdminProductNew /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'products/:productId/edit', element: <AdminProductNew /> },
          { path: 'products/:productId', element: <AdminProductDetail /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'notices/create', element: <AdminNoticesNew /> },
          { path: 'notices/:noticeId/edit', element: <AdminNoticesNew /> },
          { path: 'notices', element: <AdminNotices /> },
          { path: 'notices/:noticeId', element: <AdminNoticeDetail /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
