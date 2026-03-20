import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as O from './OrderDetailStyle';
import { verifyPayment } from "../../api/verifyPayment";
import { paymentMethodMap } from "../../constants/payment";
import { ERROR_MESSAGES } from "../../constants/errorMessage";
import { formatNumber, formatDate, toKoreanTime } from "../../utils/format";
import { API_BASE_URL } from '../../constants/api';

const OrderDetail = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const { orderId } = useParams(); 
  const [vbankInfo, setVbankInfo] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (response.data.code === 20000 && response.data.data) {
          if (response.data.data.imp_uid) {
            const vbank = await verifyPayment(response.data.data.imp_uid);
            setVbankInfo(vbank);
          }
          setOrderData(response.data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(ERROR_MESSAGES.ORDER_FETCH_FAILED);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const handleViewReceipt = () => {
    if (orderData?.receipt_url) {
      const TID = orderData.receipt_url; 
      window.open(TID, "_blank"); 
    } else {
      alert(ERROR_MESSAGES.NO_RECEIPT);
    }
  };

  const handleViewCashReceipt = () => {
    if (orderData?.cash_receipt_url) {
      const TID = orderData.cash_receipt_url; 
      window.open(TID, "_blank"); 
    } else {
      alert(ERROR_MESSAGES.NO_CASH_RECEIPT);
    }
  };
  
  if (loading) return <O.Loading>로딩 중...</O.Loading>;
  if (error) return <O.Error>{error}</O.Error>;
  if (!orderData) return null;

  return (
    <O.MainWrapper>
      <O.Container>
        <O.Title>주문확인</O.Title>
        <O.Section>
          <O.SectionTitle>주문 상세 내역</O.SectionTitle>
          <O.Details>
            <O.DetailItem>주문일자: {formatDate(orderData.orderDate)}</O.DetailItem>
            <O.DetailItem>주문번호: {orderData.imp_uid || '정보 없음'}</O.DetailItem>
            <O.DetailItem>주문상태: {orderData.orderStatus || '정보 없음'}</O.DetailItem>
          </O.Details>
          <O.Separator />
          {orderData.products && orderData.products.map((product) => (
            <O.Item key={product.productId}>
              <O.ItemImage src={product.coverImage} alt={product.productName} />
              <O.ItemDetails>
                <O.ItemName>{product.productName || '상품명 없음'}</O.ItemName>
                <O.ItemOption>
                  모델: {product.productModel || '정보 없음'}
                  <br />
                  옵션: {product.selectOption || '옵션 없음'}
                </O.ItemOption>
                <O.ItemPrice>
                  {formatNumber(product.productPrice)}원 / 수량 {product.quantity || 0}
                </O.ItemPrice>
              </O.ItemDetails>
            </O.Item>
          ))}
        </O.Section>
        <O.Section>
          <O.SectionTitle>구매자 정보</O.SectionTitle>
          {orderData.user && (
            <O.Details>
              <O.DetailItem>주문자: {orderData.user.name || '정보 없음'}</O.DetailItem>
              <O.DetailItem>연락처: {orderData.user.phone || '정보 없음'}</O.DetailItem>
              <O.DetailItem>이메일: {orderData.user.email || '정보 없음'}</O.DetailItem>
            </O.Details>
          )}
        </O.Section>
        <O.Separator />
        {orderData.deliveryAddress && (
          <O.Section>
            <O.SectionTitle>배송지 정보</O.SectionTitle>
            <O.Details>
              <O.DetailItem>수령인: {orderData.deliveryAddress.recipientName || '정보 없음'}</O.DetailItem>
              <O.DetailItem>연락처: {orderData.deliveryAddress.phoneNumber || '연락처 없음'}</O.DetailItem>
              <O.DetailItem>
                배송지: {orderData.deliveryAddress.address || '정보 없음'} 
                ({orderData.deliveryAddress.zipcode || '우편번호 없음'}), ({orderData.deliveryAddress.addressDetail || '상세주소 없음'})
              </O.DetailItem>
              <O.DetailItem>상세 주소: {orderData.deliveryAddress.addressDetail || '정보 없음'}</O.DetailItem>
            </O.Details>
          </O.Section>
        )}
        <O.Separator />
          <O.Section>
            <O.SectionTitle>배송 요청사항</O.SectionTitle>
            <O.Details>
              <O.DetailItem>{orderData.request  || '요청사항이 없습니다.'}</O.DetailItem>
            </O.Details>
          </O.Section>
        <O.Separator />
        <O.Section>
          <O.SectionTitle>주문 금액 상세</O.SectionTitle>
          <O.Details>
            <O.DetailItem>주문금액: {formatNumber(orderData.price)}원</O.DetailItem>
            <O.DetailItem>할인금액: {formatNumber(orderData.discountPrice)}원</O.DetailItem>
            <O.DetailItem>배송비: {formatNumber(orderData.shippingCost)}원</O.DetailItem>
            <O.DetailItem>총 주문금액: {formatNumber(orderData.totalPrice)}원</O.DetailItem>
            <O.DetailItem>결제수단: {paymentMethodMap[orderData.paymentMethod] || orderData.paymentMethod?.paymentMethod}</O.DetailItem>
          </O.Details>
        </O.Section>
        <O.Separator />
        {orderData.paymentMethod === 'V_BANK' && vbankInfo && (
          <>
            <O.Section>
              <O.SectionTitle>가상계좌 정보</O.SectionTitle>
              <O.Details>
                <O.DetailItem>예금주: {vbankInfo.buyer_name || '정보 없음'}</O.DetailItem>
                <O.DetailItem>은행명: {vbankInfo.vbank_name || '정보 없음'}</O.DetailItem>
                <O.DetailItem>계좌번호: {vbankInfo.vbank_num || '정보 없음'}</O.DetailItem>
                <O.DetailItem>입금기한: {toKoreanTime(vbankInfo.vbank_date) || '정보 없음'}</O.DetailItem>
              </O.Details>
            </O.Section>
            <O.Separator />
          </>
        )}
        <div style={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', gap: '10px'}}>
        <O.ReceiptButton onClick={handleViewReceipt}>매출전표 보기</O.ReceiptButton>
        {orderData.cash_receipt_url && (
          <O.CashReceiptButton onClick={handleViewCashReceipt}>현금 영수증 보기</O.CashReceiptButton>
        )}
        </div>
      </O.Container>
    </O.MainWrapper>
  );
};

export default OrderDetail;
