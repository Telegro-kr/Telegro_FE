import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminNav from "./components/AdminNav/AdminNav";
import ClientManagementPage from "./pages/ClientManagement";
import ClientDetail from "./components/Admin/ClientDetail";
import StatPage from "./pages/Stat";
import AdminNoticePage from "./pages/AdminNotice";
import NoticeCreatePage from "./pages/NoticeCreate";
import AdminNoticeDetailPage from "./pages/AdminNoticeDetail";
import AdminNoticeEditPage from "./pages/AdminNoticeEdit";
import ProductCreatePage from "./pages/ProductCreate";
import Headset from "./components/Admin/ProductList/Headset";
import LineCord from "./components/Admin/ProductList/LineCord";
import Recording from "./components/Admin/ProductList/Recording";
import Accessory from "./components/Admin/ProductList/Accessory";
import AdminProductDetailPage from "./pages/AdminProductDetail";
import AdminOrderListPage from "./pages/AdminOrderList";
import AddClientPage from "./pages/AddClient";
import AdminProductEditPage from "./pages/AdminProductEdit";
import ClientEditPage from "./pages/ClientEdit";
import ScrollToTop from "./ScrollToTop";
import AdminSearchResult from "./components/AdminNav/AdminSearchResult";
import AdminOrderDetailPage from "./pages/AdminOrderDetail";

export default function Admin() {
  const isAdmin = useSelector((state) => state.auth.userRole === "ADMIN");
  if (!isAdmin) {
    alert("관리자 권한이 없습니다.");
    return <Navigate to="/" replace />;
  }
  return (
    <div>
      <AdminNav />
      <ScrollToTop />
      <Routes>
        <Route path="clientmanagement" element={<ClientManagementPage />} />
        <Route path="clientdetail/:clientId" element={<ClientDetail />} />
        <Route path="notice" element={<AdminNoticePage />} />
        <Route path="noticecreate" element={<NoticeCreatePage />} />
        <Route path="noticeedit/:noticeId" element={<AdminNoticeEditPage />} />
        <Route path="noticedetail/:noticeId" element={<AdminNoticeDetailPage />} />
        <Route path="stat" element={<StatPage />} />
        <Route path="productcreate" element={<ProductCreatePage />} />
        <Route path="headset" element={<Headset />} />
        <Route path="lineCord" element={<LineCord />} />
        <Route path="recording" element={<Recording />} />
        <Route path="accessory" element={<Accessory />} />
        <Route path="adminproductdetail/:productId" element={<AdminProductDetailPage />} />
        <Route path="adminproductedit/:productId" element={<AdminProductEditPage />} />
        <Route path="orderlist" element={<AdminOrderListPage />} />
        <Route path="addclient" element={<AddClientPage />} />
        <Route path="clientedit/:clientId" element={<ClientEditPage />} />
        <Route path="adminsearch" element={<AdminSearchResult />} />
        <Route path="orderlist/:orderId" element={<AdminOrderDetailPage />} />
      </Routes>
    </div>
  );
}
