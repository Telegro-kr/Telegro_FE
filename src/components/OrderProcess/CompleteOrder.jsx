import { useNavigate, useLocation } from "react-router-dom";
import { toKoreanTime } from "../../utils/format";
import * as O from "./OrderProcessStyle";
import defaultImg from "../Check/image.svg";
const CompleteOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useLocation();
  const { vbankInfo } = location.state || {};
  const {
    orderDetails = { products: [], total: 0 },
    userDetails = { name: "", phone: "", recipientName: "" },
    shippingInfo = { postalCode: "", address: "", detailedAddress: "" },
    pointsToUse = 0,
    pointsToEarn = 0,
    shippingCost = 0,
    orderId = "N/A",
    orderDate = new Date().toISOString().slice(0, 10),
  } = state || {};

  const formatPrice = (price) =>
    new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(price);
  const orderImage =
    orderDetails.products.length > 0 ? orderDetails.products[0].coverImage : defaultImg;

  if (!state) {
    return (
      <O.CompleteOrderWrapper>
        <p>주문 정보를 불러올 수 없습니다. 다시 시도해주세요.</p>
        <O.Button onClick={() => navigate("/")}>홈으로 이동</O.Button>
      </O.CompleteOrderWrapper>
    );
  }

  return (
    <O.CompleteOrderWrapper>
      <O.CompleteImage src={orderImage} alt="Order Complete" />
      <O.Title>주문이 완료되었습니다</O.Title>
      <O.OrderInfo>
        {orderDate}에 주문하신 상품의 주문번호는 <span>{orderId}</span>입니다.
      </O.OrderInfo>

      <O.SectionTitle style={{ textAlign: "left" }}>주문 상품</O.SectionTitle>
      <O.Table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>수량</th>
            <th>결제금액</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.products.map((product, index) => (
            <tr key={index}>
              <td>
                <img
                  src={product.coverImage}
                  alt="상품 이미지"
                  style={{ width: "50px", marginRight: "10px" }}
                />
                {product.name}
              </td>
              <td>{product.quantity}</td>
              <td>{formatPrice(product.totalPrice)}원</td>
            </tr>
          ))}
        </tbody>
      </O.Table>
      <div style={{ textAlign: "left" }}>
        <O.SectionTitle style={{ marginTop: "30px" }}>배송지 정보</O.SectionTitle>
      </div>
      <O.InfoBox>
        <div>
          <h4>이름</h4>
          <p>{userDetails.name}</p>
          <h4>휴대전화번호</h4>
          <p>{userDetails.phone}</p>
          <h4>배송지 주소</h4>
          <p>
            ({shippingInfo.postalCode}) {shippingInfo.address}, {shippingInfo.detailedAddress}
          </p>
        </div>
        <div>
          <h4>결제 정보</h4>
          <p>
            상품금액: <span>{formatPrice(orderDetails.total)}</span>
          </p>
          <p>
            할인금액: <span style={{ color: "red" }}>-{formatPrice(pointsToUse)}</span>
          </p>
          <p>
            적립예정 포인트: <span>{pointsToEarn}P</span>
          </p>
          <p>
            배송비: <span>{formatPrice(shippingCost)}</span>
          </p>
          <h4 style={{ marginTop: "4vh" }}>총 결제 금액</h4>
          <p>
            <span style={{ fontWeight: "bold" }}>
              {formatPrice(orderDetails.total - pointsToUse + shippingCost)}
            </span>
          </p>
        </div>
        {vbankInfo && (
          <div>
            <h4>가상계좌 정보</h4>
            <p>
              은행명: <strong>{vbankInfo.vbank_name}</strong>
            </p>
            <p>
              계좌번호: <strong>{vbankInfo.vbank_num}</strong>
            </p>
            <p>
              예금주: <strong>{vbankInfo.vbank_holder || "정보 없음"}</strong>
            </p>
            <p>
              입금기한: <strong>{toKoreanTime(vbankInfo.vbank_date)}</strong>
            </p>
          </div>
        )}
      </O.InfoBox>
      <O.Button onClick={() => navigate("/")}>확인</O.Button>
    </O.CompleteOrderWrapper>
  );
};

export default CompleteOrder;
