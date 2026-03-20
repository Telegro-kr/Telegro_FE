import { useState, useEffect } from 'react';
import * as P from './ProductDetailStyle';
import * as O from '../OrderProcess/OrderProcessStyle';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import img from './example.svg';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import store from '../../store';
import { API_BASE_URL } from '../../constants/api';

const ProductDetail = () => {
  const navigate = useNavigate();
  const [inputOption, setInputOption] = useState('');
  const [product, setProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description'); 
  const { productId } = useParams();
  const apiClient = axios.create({
    baseURL: `${API_BASE_URL}`, 
    timeout: 5000,
  });
  
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const { response } = error;
  
      if (response && (response.status === 401 || response.data.code === 40100)) {
        const state = store.getState();
        const userRole = state.auth.userRole;
  
        if (!userRole) {
          alert('먼저 로그인을 해주세요.');
        }
      }
      return Promise.reject(error);
    }
  );
  const handleInputOptionChange = (e) => {
    setInputOption(e.target.value);
  };

  const handleAddCart = async () => {
    if (!selectedOption) {
      alert('옵션을 선택해주세요.');
      return;
    }
    try {
      const accessToken = localStorage.getItem('token');
      const response = await apiClient.post(
        `${API_BASE_URL}/api/carts/${productId}`,
        {
          selectOption: selectedOption,
          quantity: quantity,
          inputOption: inputOption
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      if (response.status === 200) {
        alert('상품이 장바구니에 담겼습니다!');
      } else {
        alert('장바구니에 담기 실패: ' + response.data.message);
      }
    } catch (error) {
      if (error.status === 401){
        alert('로그인을 먼저 진행해주세요.');
      }
      console.error(error);
    }
  };

  const handlePurchase = async () => {
    if (!selectedOption) {
      alert("옵션을 선택해주세요.");
      return;
    }
  
    try {
      const accessToken = localStorage.getItem("token");
  
      const cartResponse = await apiClient.post(
        `${API_BASE_URL}/api/carts/${productId}`,
        {
          selectOption: selectedOption,
          quantity: quantity,
          inputOption: inputOption,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      if (cartResponse.status === 200) {
        const cartId = cartResponse.data.data.id; 
  
        const orderResponse = await apiClient.post(
          `/api/orders/create`,
          [cartId],
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
  
        if (orderResponse.data.code === 20000) {

          navigate("/orderprocess", {
            state: {
              orderData: orderResponse.data.data,
              userDetails: {
                userName: orderResponse.data.data.userName,
                userEmail: orderResponse.data.data.userEmail,
                totalPrice: orderResponse.data.data.totalPrice,
                totalPoint: orderResponse.data.data.totalPoint,
                pointToEarn: orderResponse.data.data.pointToEarn,
              },
            },
          });
        } else {
          alert(
            "주문 생성에 실패했습니다. 오류 메시지: " +
              orderResponse.data.message
          );
        }
      } else {
        alert("장바구니에 담기 실패: " + cartResponse.data.message);
      }
    } catch (error) {
      if (error.status === 401){
        alert('로그인을 먼저 진행해주세요.');
      }
      alert('장바구니에 상품을 담는 중 오류가 발생했습니다.');
    }
  };  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.status === 200) {
          setProduct(response.data.data);
        }
      } catch {
        alert('상품 정보를 가져오는 데 실패했습니다.');
      }
    };
    fetchProduct();
  }, [productId]);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.pictures.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.pictures.length - 1 : prevIndex - 1
    );
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(99, e.target.value));
    setQuantity(value);
  };

  if (!product) {
    return <div>로딩 중...</div>;
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  }

  return (
    <>
      <P.MainWrapper>
        <P.ProductPageWrapper>
          <P.CategoryTag category={product.category}>
            <p>category: {product.category}</p>
          </P.CategoryTag>
          <P.ProductDetails>
            <P.ProductInfoWrapper>
              <P.ProductImage src={product.pictures[0] || img} alt="Main Product" />
              <div>
                <P.ProductTitle>{product.productName}</P.ProductTitle>
                <P.ProductSubtitle>{product.productModel}</P.ProductSubtitle>
                <P.PriceTag>{formatPrice(product.price)}</P.PriceTag>
              </div>
            </P.ProductInfoWrapper>

            <P.AdditionalImagesWrapper>
              {product.pictures.slice(1).map((picture, index) => (
                <P.AdditionalImage
                  style={{ cursor: 'pointer' }}
                  key={index}
                  src={picture}
                  alt={`Additional Image ${index + 1}`}
                  onClick={() => openModal(index)}
                />
              ))}
              <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={{
                  content: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    inset: 0,
                  },
                  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                }}
              >
                <P.LeftArrow onClick={prevImage}>&lt;</P.LeftArrow>
                <P.ModalImage src={product.pictures[currentImageIndex]} onClick={closeModal} alt="Modal" />
                <P.RightArrow onClick={nextImage}>&gt;</P.RightArrow>
              </Modal>
            </P.AdditionalImagesWrapper>
          </P.ProductDetails>

          <P.Tabs>
            <P.Tab isActive={activeTab === 'description'} onClick={() => setActiveTab('description')}>
              상품 설명
            </P.Tab>
            <P.Tab isActive={activeTab === 'shipping'} onClick={() => setActiveTab('shipping')}>
              교환/배송
            </P.Tab>
          </P.Tabs>

          <P.ContentWrapper>
            {activeTab === 'description' ? (
              <P.DescriptionList>
                <P.DescriptionTitle>상품 설명</P.DescriptionTitle>
                <P.DescriptionItem className="toastui-editor-contents" dangerouslySetInnerHTML={{ __html: product.content }} />
                <P.OrderPageWrapper>
                <P.LeftSection>
                <O.SectionTitle>교환 반품 안내</O.SectionTitle>
                <P.NoticeBox>
                <p>판매자에게 입금으로 배송비를 지불하실 경우, 교환/반품 택배비는 계좌입금 부탁드립니다. (상품동봉 불가)</p>
                <li>입금 시에는 주문자명으로 입금해주세요. (다를 경우엔 문의주세요.)</li>
                <div className="highlight-box">
                <li>입금계좌: 우리은행 540-263910-02-001(예금주: 연경진) </li>
                <li>반품 및 교환 배송지: 기존 AS 물류배송지</li>
                </div>
              </P.NoticeBox>
                </P.LeftSection>
                <P.RightSection>
                <O.SectionTitle>배송 안내</O.SectionTitle>
                <P.NoticeBox>
                <li>택배비: 기본 <span className="highlight">3,000원(선불)</span>, 반품 시 왕복 <span className="highlight">6,000원</span> 부담</li>
                <li>고객 부주의(주문 착오, 주소, 전화번호 오기재, 연락두절 등)로 인해 반품되는 경우에 왕복 택배비는 고객 부담입니다.</li>
                <li>제품 배송은 택배사 사정에 따라 제품 발송 후 평균 2-3일 정도 소요됩니다.(주말, 공휴일 제외, 일부 지역에 따라 배송 기간이 달라질 수 있음)</li>
                <li>배송 준비 상태의 주문은 택배사 인계 중이므로 주문 취소는 되지 않습니다.</li>
                <div className="highlight-box">
                  <p>- 평일 오후 2시 이전 주문 건은 당일, 이후 주문 건은 익일 발송</p>
                  <p>- 주말 및 법정 공휴일은 휴무</p>
                  <p>- 제품별 재고 여부에 따라 출고일이 변경될 수 있습니다.</p>
                </div>
              </P.NoticeBox>
                </P.RightSection>
                </P.OrderPageWrapper>
                <div style={{marginLeft: '2.3%', fontWeight: 'bold'}}><h1>A/S 정책 안내</h1></div>
                <P.OrderPageWrapper>
                <P.LeftSection>
                <P.NoticeBox>
                <O.SectionTitle>교환/환불이 <span style={{ color: '#0000ff'}}>가능</span>한 경우</O.SectionTitle>
                <p>배송된 상품이 주문내용과 다르거나, 상세페이지 내용과 상이할 경우</p>
                <p>상품이 파손, 손상되어 배송된 경우</p>
                <p>그외, 판매자 귀책 사유로 인한 교환/환불인 경우</p>
              </P.NoticeBox>
                </P.LeftSection>
                <P.RightSection>
                <P.NoticeBox>
                <O.SectionTitle>교환/환불이 <span style={{ color: '#ff0000'}}>불가능</span>한 경우</O.SectionTitle>
                <p>제품 개봉 후 단순변심인 경우(상품확인을 위한 택배박스 개봉은 가능)</p>
                <p>배송완료 후 7일이 경과한 경우</p>
                <p>소비자의 부주의로 제품이 파손, 손상된 경우</p>
                <p>구매자의 오주문인 경우, 택배비는 구매자께서 부담하셔야 합니다.</p>
              </P.NoticeBox>
                </P.RightSection>
                </P.OrderPageWrapper>
              </P.DescriptionList>
            ) : (
              <>
              <P.DescriptionTitle>거래 조건에 관한 정보</P.DescriptionTitle>
              <P.ShippingTable>
                <P.ShippingRow>
                  <P.ShippingCell style={{fontWeight: 'bold'}}>재화 등의 배송방법에 관한 정보</P.ShippingCell>
                  <P.ShippingCell style={{fontWeight: 'bold'}}>택배</P.ShippingCell>
                </P.ShippingRow>
                <P.ShippingRow>
                  <P.ShippingCell>주문 이후 예상되는 배송기간</P.ShippingCell>
                  <P.ShippingCell>대금 지급일로부터 3일 이내에 발송</P.ShippingCell>
                </P.ShippingRow>
                <P.ShippingRow>
                  <P.ShippingCell>제품하자·오배송 등에 따른 청약철회 등의 경우 청양철회 등의 기한 및 통신판매업자가 부담하는 반품비용 등에 관한 정보</P.ShippingCell>
                  <P.ShippingCell>전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.</P.ShippingCell>
                </P.ShippingRow>
                <P.ShippingRow>
                  <P.ShippingCell>제품하자가 아닌 소비자의 단순변심에 따른 청약철회 시 소비자가 부담하는 반품비용 등에 관한 정보</P.ShippingCell>
                  <P.ShippingCell>편도 3,000원 (최초 배송비 무료인 경우 6000원 부과).</P.ShippingCell>
                </P.ShippingRow>
                <P.ShippingRow>
                  <P.ShippingCell>제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거</P.ShippingCell>
                  <P.ShippingCell>전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.</P.ShippingCell>
                </P.ShippingRow>
                <P.ShippingRow>
                  <P.ShippingCell>재화 등의 교환·반품·보증 조건 및 품질보증기준</P.ShippingCell>
                  <P.ShippingCell>소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.</P.ShippingCell>
                </P.ShippingRow>
                <P.ShippingRow>
                  <P.ShippingCell>재화 등의 A/S 관련 연락</P.ShippingCell>
                  <P.ShippingCell>웹사이트 우측 하단 카카오톡 채널로 문의.</P.ShippingCell>
                </P.ShippingRow>
                <P.ShippingRow>
                  <P.ShippingCell>대금을 환불받기 위한 방법과 환불이 지연될 경우 자연배상금을 지급받을 수 있다는 자연배상금 지급의 구체적인 조건·절차</P.ShippingCell>
                  <P.ShippingCell>웹사이트 우측 하단 카카오톡 채널로 문의.</P.ShippingCell>
                </P.ShippingRow>
                <P.ShippingRow>
                  <P.ShippingCell>소비자피해보상의 처리, 재화등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁처리에 관한 사항</P.ShippingCell>
                  <P.ShippingCell>소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.</P.ShippingCell>
                </P.ShippingRow>
                <P.ShippingRow>
                  <P.ShippingCell>거래에 관한 약관의 내용 또는 확인할 수 있는 방법</P.ShippingCell>
                  <P.ShippingCell>상품상세 페이지 및 페이지 하단의 이용약관 링크를 통해 확인할 수 있습니다.</P.ShippingCell>
                </P.ShippingRow>
              </P.ShippingTable>
              </>
            )}
          </P.ContentWrapper>
        </P.ProductPageWrapper>

        <P.StickyBarWrapper>
          <P.OptionSelectWrapper>
            <P.DescriptionTitle style={{ fontSize: '1.2rem' }} htmlFor="optionSelect">옵션 선택</P.DescriptionTitle>
            <P.Select id="optionSelect" value={selectedOption} onChange={handleOptionChange}>
              <option value="">옵션을 선택하세요</option>
              {product.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </P.Select>
            {(product.category === 'HEADSET' || product.category === 'LINE_CORD' || product.category === 'RECORDER') && (
              <>
                <P.DescriptionTitle style={{ fontSize: '1.2rem', paddingTop: '3%' }} htmlFor="inputoption">사용 전화기명 기재(전화기뒷면)</P.DescriptionTitle>
                <P.QuantityInput
                  type="text"
                  id="inputoption"
                  value={inputOption}
                  onChange={handleInputOptionChange}
                  placeholder="옵션을 입력하세요"
                />
              </>
            )}
            <P.DescriptionTitle style={{ fontSize: '1.2rem', paddingTop: '3%' }} htmlFor="quantity">수량</P.DescriptionTitle>
            <P.QuantityInput
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max="99"
            />
          </P.OptionSelectWrapper>

          <P.ButtonWrapper>
            <P.BuyButton onClick={handlePurchase}>구매하기</P.BuyButton>
            <P.BuyButton onClick={handleAddCart}>장바구니</P.BuyButton>
          </P.ButtonWrapper>
        </P.StickyBarWrapper>
        <P.Div></P.Div>
      </P.MainWrapper>
    </>
  );
};

export default ProductDetail;
