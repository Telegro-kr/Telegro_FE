import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { API_BASE_URL } from '../../constants/api';

const OrderDetail = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const { orderId } = useParams(); 
  const paymentMethodMap = {
    'CREDIT_CARD': '카드',
    'V_BANK': '가상계좌',
    'BANK_TRANSFER': '계좌이체'
  };

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
          setOrderData(response.data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch {
        setError("주문 상세 정보를 가져오는 데 실패했습니다.");
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
      alert("영수증을 볼 수 없습니다. TID가 누락되었습니다.");
    }
  };

  const handleViewCashReceipt = () => {
    if (orderData?.cash_receipt_url) {
      const TID = orderData.cash_receipt_url; 
      window.open(TID, "_blank"); 
    } else {
      alert("현금영수증을 볼 수 없습니다. TID가 누락되었습니다.");
    }
  };
  const formatNumber = (value) => {
    return value !== undefined && value !== null 
      ? Number(value).toLocaleString()
      : '0';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '정보 없음';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  

  if (loading) return <Loading>로딩 중...</Loading>;
  if (error) return <Error>{error}</Error>;
  if (!orderData) return null;

  return (
    <MainWrapper>
      <Container>
        <Title>주문확인</Title>
        
        <Section>
          <SectionTitle>주문 상세 내역</SectionTitle>
          <Details>
            <DetailItem>주문일자: {formatDate(orderData.orderDate)}</DetailItem>
            <DetailItem>주문번호: {orderData.imp_uid || '정보 없음'}</DetailItem>
            <DetailItem>주문상태: {orderData.orderStatus || '정보 없음'}</DetailItem>
          </Details>
          <Separator />
          
          {orderData.products && orderData.products.map((product) => (
            <Item key={product.productId}>
              <ItemImage src={product.coverImage} alt={product.productName} />
              <ItemDetails>
                <ItemName>{product.productName || '상품명 없음'}</ItemName>
                <ItemOption>
                  모델: {product.productModel || '정보 없음'}
                  <br />
                  옵션: {product.selectOption || '옵션 없음'}
                </ItemOption>
                <ItemPrice>
                  {formatNumber(product.productPrice)}원 / 수량 {product.quantity || 0}
                </ItemPrice>
              </ItemDetails>
            </Item>
          ))}
        </Section>

        <Section>
          <SectionTitle>구매자 정보</SectionTitle>
          {orderData.user && (
            <Details>
              <DetailItem>주문자: {orderData.user.name || '정보 없음'}</DetailItem>
              <DetailItem>연락처: {orderData.user.phone || '정보 없음'}</DetailItem>
              <DetailItem>이메일: {orderData.user.email || '정보 없음'}</DetailItem>
            </Details>
          )}
        </Section>
        <Separator />

        {orderData.deliveryAddress && (
          <Section>
            <SectionTitle>배송지 정보</SectionTitle>
            <Details>
              {/* 수령인 정보 */}
              <DetailItem>
                수령인: {orderData.deliveryAddress.recipientName ? orderData.deliveryAddress.recipientName : '정보 없음'}
              </DetailItem>
              {/* 연락처 */}
              <DetailItem>
                연락처: {orderData.deliveryAddress.phoneNumber ? orderData.deliveryAddress.phoneNumber : '연락처 없음'}
              </DetailItem>
              {/* 주소 */}
              <DetailItem>
                배송지: {orderData.deliveryAddress.address || '정보 없음'} 
                ({orderData.deliveryAddress.zipcode || '우편번호 없음'}), 
                {orderData.deliveryAddress.addressDetail || '상세주소 없음'}
              </DetailItem>
              {/* 상세 주소 */}
              <DetailItem>
                상세 주소: {orderData.deliveryAddress.addressDetail || '정보 없음'}
              </DetailItem>
            </Details>
          </Section>
        )}
        <Separator />
          <Section>
            <SectionTitle>배송 요청사항</SectionTitle>
            <Details>
              <DetailItem>{orderData.request  || '요청사항이 없습니다.'}</DetailItem>
            </Details>
          </Section>
        <Separator />

        <Section>
          <SectionTitle>주문 금액 상세</SectionTitle>
          <Details>
            <DetailItem>주문금액: {formatNumber(orderData.price)}원</DetailItem>
            <DetailItem>할인금액: {formatNumber(orderData.discountPrice)}원</DetailItem>
            <DetailItem>배송비: {formatNumber(orderData.shippingCost)}원</DetailItem>
            <DetailItem>총 주문금액: {formatNumber(orderData.totalPrice)}원</DetailItem>
            <DetailItem>결제수단: {paymentMethodMap[orderData.paymentMethod] || orderData.paymentMethod?.paymentMethod}</DetailItem>
          </Details>
        </Section>
        <Separator />
        <ReceiptButton onClick={handleViewReceipt}>매출전표 보기</ReceiptButton>
        {orderData.cash_receipt_url && (
          <CashReceiptButton onClick={handleViewCashReceipt}>현금 영수증 보기</CashReceiptButton>
        )}
      </Container>
    </MainWrapper>
  );
};

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 10px;
  margin-top: 4px;
  font-weight: bold;
  color: #555;
`;

const OrderInfo = styled.div`
  margin-bottom: 10px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  background: #ccc;
  border-radius: 5px;
`;

const ItemDetails = styled.div`
  flex: 1;
  margin-left: 10px;
`;

const ItemName = styled.div`
  font-weight: bold;
`;

const ItemOption = styled.div`
  color: #555;
  margin: 5px 0;
`;

const ItemPrice = styled.div`
  color: #333;
`;

const ItemStatus = styled.div`
  text-align: right;
  margin-top: 5px;
  padding: 5px 10px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
`;

const Details = styled.div`
  margin-top: 10px;
`;

const DetailItem = styled.div`
  margin-bottom: 5px;
`;

const MainWrapper = styled.div`
  width: 70%; 
  user-select: text;
  margin-left: 280px;
  margin-top: 3%;
  margin-bottom: 5%;
  @media(max-width: 780px){
    width: 100%; 
    margin: 5% 1%;
  }
`;
const Title = styled.h2`
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 20px;
  @media(max-width: 780px){
    font-size: 1.9rem;
    padding-top: 5px;
    margin-top: 10%;
  }
`;

const Separator = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 10px 0;
`;

const ReceiptButton = styled.button`
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #28a745; 
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.4rem;

  &:hover {
    background-color: #218838; 
  }
`;

const CashReceiptButton = styled.button`
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.4rem;

  &:hover {
    background-color: #0056b3;
  }
`;


const Loading = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 1.5rem;
`;

const Error = styled.div`
  text-align: center;
  padding: 20px;
  color: red;
  font-size: 1.2rem;
`;

export default OrderDetail;
