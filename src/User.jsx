import { Route, Routes } from "react-router-dom";
import ResponseNav from "./components/Nav/ResponseNav";
import Footer from "./components/Footer/Footer";
import NotificationBar from "./components/NotificationBar/NotificationBar";
import MainPage from "./pages/Main";
import NoticePage from "./pages/Notice";
import NoticeDetailPage from "./pages/NoticeDetail";
import OrderDetailPage from "./components/OrderManager/OrderDetail";
import OrderProcessPage from "./components/OrderProcess/OrderProcess";
import Headset from "./components/Product/Headset";
import LineCord from "./components/Product/LineCord";
import Recording from "./components/Product/Recording";
import Accessory from "./components/Product/Accessory";
import ProductDetailPage from "./pages/ProductDetail";
import ChatButton from "./components/ChatButton/ChatButton";
import OrderManagerPage from "./pages/OrderManager";
import NoticePopup from "./components/NoticePopup/NoticePopup";
import CartPage from "./pages/Cart";
import ScrollToTop from "./ScrollToTop";
import MypagePage from "./pages/Mypage";
import SearchResult from "./components/Nav/SearchResult";
import CompleteOrder from "./components/OrderProcess/CompleteOrder";
import Privacy from "./components/Privacy/Privacy";

export default function User() {
  return (
    <div>
      <ResponseNav />
      <ScrollToTop />
      <Routes>
        <Route path="/search" element={<SearchResult />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/noticedetail/:noticeId" element={<NoticeDetailPage />} />
        <Route path="/productdetail/:productId" element={<ProductDetailPage />} />
        <Route path="/headset" element={<Headset />} />
        <Route path="/lineCord" element={<LineCord />} />
        <Route path="/recording" element={<Recording />} />
        <Route path="/accessory" element={<Accessory />} />
        <Route path="/ordermanager" element={<OrderManagerPage />} />
        <Route path="/ordermanager/:orderId" element={<OrderDetailPage />} />
        <Route path="/orderprocess" element={<OrderProcessPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/mypage" element={<MypagePage />} />
        <Route path="/completeorder" element={<CompleteOrder />} />
        <Route path="/privacy" element={<Privacy activeTab="privacy" />} />
        <Route path="/terms" element={<Privacy activeTab="terms" />} />
      </Routes>
      <NotificationBar />
      <NoticePopup />
      <ChatButton />
      <Footer />
    </div>
  );
}
