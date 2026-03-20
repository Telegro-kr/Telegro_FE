import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import check from '/src/assets/icon/Admin/check.svg';
import checked from '/src/assets/icon/Admin/checked.svg';
import { useNavigate } from 'react-router-dom';
import Delete from '/src/assets/icon/delete.svg';
import { API_BASE_URL } from '../../constants/api';

const Cart = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedTotalPrice, setSelectedTotalPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  useEffect(() => {
    const fetchCartItems = async () => {
        try {
            const accessToken = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/carts?page=0&size=10`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.status === 200 && response.data.data) {
                const cartItems = await Promise.all(response.data.data.carts.map(async (product) => {
                    if (product.productOptions.length === 1 && !product.selectOption) {
                        product.selectOption = product.productOptions[0];
                        await updateCartItem(product.id, product.selectOption, product.inputOption, product.quantity);
                    }
                    return product;
                }));
                setProducts(cartItems);
            } else {
              alert('장바구니 정보를 불러오는 데 실패했습니다.');
            }
        } catch {
          alert('장바구니 정보를 불러오는 데 실패했습니다.');
        }
    };

    fetchCartItems();
}, []);
  
  useEffect(() => {
    const total = products.reduce((acc, product) => acc + (product.productPrice * product.quantity), 0);
    const selectedTotal = products.reduce((acc, product) => product.selected ? acc + (product.productPrice * product.quantity) : acc, 0);
    setTotalPrice(total);
    setSelectedTotalPrice(selectedTotal);
  }, [products]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('정말로 이 상품을 장바구니에서 삭제하시겠습니까?');
    if (!confirmDelete) {
      return;
    }
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}/api/carts/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200) {
        setProducts(products.filter(product => product.id !== id));
        alert('상품이 장바구니에서 삭제되었습니다.');
      } else {
        alert('상품 삭제에 실패했습니다.');
      }
    } catch {
      alert('장바구니 항목을 삭제하는 중 오류가 발생했습니다.');
    }
  };
  const handleIncreaseQuantity = async (id) => {
    const newProducts = products.map(product =>
      product.id === id ? { ...product, quantity: product.quantity + 1 } : product
    );
    setProducts(newProducts);
    
    const updatedProduct = newProducts.find(p => p.id === id);
    
    try {
      const accessToken = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/carts/${id}`,
        {
          quantity: updatedProduct.quantity 
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      console.log('수량이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('수량 업데이트 중 오류가 발생했습니다:', error);
    }
  };
  useEffect(() => {
    const totalPrice = products.reduce((acc, product) => {
      return product.selected ? acc + product.productPrice * product.quantity : acc;
    }, 0);
    setSelectedTotalPrice(totalPrice);
  }, [products]);
  
  function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  }

  useEffect(() => {
    const total = products.reduce((acc, product) => acc + product.productPrice * product.quantity, 0);
    setTotalPrice(total);
    const selectedTotal = products.reduce((acc, product) => product.selected ? acc + product.productPrice * product.quantity : acc, 0);
    setSelectedTotalPrice(selectedTotal);
  }, [products]);  

  const handleDecreaseQuantity = async (id) => {
    const newProducts = products.map(product =>
      product.id === id ? { ...product, quantity: Math.max(product.quantity - 1, 1) } : product
    );
    setProducts(newProducts);
    
    const updatedProduct = newProducts.find(p => p.id === id);
    
    try {
      const accessToken = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/carts/${id}`,
        {
          quantity: updatedProduct.quantity
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      console.log('수량이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('수량 업데이트 중 오류가 발생했습니다:', error);
    }
  };
  
  
  const handleOptionChange = (id, selectedOption) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, selectOption: selectedOption } : product
    ));

    const product = products.find(product => product.id === id);
    if (product && product.selectOption !== selectedOption) {
      updateCartItem(id, selectedOption, product.inputOption, product.quantity);
    }
  };
  const handleInputOptionChange = async (id, inputOptionValue) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, inputOption: inputOptionValue } : product
    ));
  
    try {
      const accessToken = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/carts/${id}`,
        {
          inputOption: inputOptionValue 
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      console.log('기재형 옵션이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('기재형 옵션 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  const updateCartItem = async (cartId, selectOption, inputOption, quantity) => {
    try {
      const accessToken = localStorage.getItem('token');
  
      const response = await axios.put(
        `${API_BASE_URL}/api/carts/${cartId}`,
        {
          selectOption, 
          inputOption, 
          quantity: parseInt(quantity, 10) 
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
  
      if (response.status === 200) {
        console.log('장바구니가 성공적으로 업데이트되었습니다.');
      } else {
        alert('장바구니 업데이트 실패: ' + response.data.message);
      }
    } catch {
      alert('장바구니 항목을 업데이트하는 중 오류가 발생했습니다.');
    }
  };
  const handleCheckboxChange = (id) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, selected: !product.selected } : product
    ));
  };


  const handlePurchase = async () => {
    const selectedCartIDs = products.filter(product => product.selected).map(product => product.id);
    if (selectedCartIDs.length === 0) {
        alert('구매할 상품을 선택해주세요.');
        return;
    }

    try {
        const accessToken = localStorage.getItem('token');
        const config = {
            method: 'post',
            url: `${API_BASE_URL}/api/orders/create`,
            data: selectedCartIDs,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        };

        const response = await axios(config);
        if (response.data.code === 20000) {
            navigate('/orderprocess', {
                state: {
                    orderData: response.data.data,
                    userDetails: {
                        userName: response.data.data.userName,
                        userEmail: response.data.data.userEmail,
                        totalPrice: response.data.data.totalPrice,
                        totalPoint: response.data.data.totalPoint,
                        pointToEarn: response.data.data.pointToEarn
                    }
                }
            });
        } else {
            alert('주문 생성에 실패했습니다. 오류 메시지: ' + response.data.message);
        }
    } catch {
      alert('주문 생성 중 오류가 발생했습니다. 오류 로그를 확인해주세요.');
    }
};

  return (
    <>
      <Div></Div>
      <Title><h1>장바구니</h1></Title>
      <OrderPageWrapper>
        <LeftSection>
          {products.map(product => (
            <ProductItem key={product.id}>
              <CheckboxContainer style={{ alignItems: 'center' }}>
                <img
                  src={product.selected ? checked : check}
                  alt="체크박스 이미지"
                  onClick={() => handleCheckboxChange(product.id)}
                  style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                />
              </CheckboxContainer>
              <ProductInfo>
                <ProductImage src={product.coverImage} alt="상품 이미지" />
                <ProductDetails>
                  <ProductName>{product.productName}</ProductName>
                  <ProductModel>{product.productModel}</ProductModel>
                  <select
                    value={product.selectOption || ''}
                    onChange={(e) => handleOptionChange(product.id, e.target.value)}
                  >
                    {product.productOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {(product.productCategory === 'HEADSET' || product.productCategory === 'LINE_CORD' || product.productCategory === 'RECORDER') && (
              <>
                <OptionInputWrapper>
                  <input
                    style={{ border: '1px solid #555', borderRadius: '3px'}}
                    type="text"
                    value={product.inputOption || ''}
                    onChange={(e) => handleInputOptionChange(product.id, e.target.value)}
                    placeholder="기타 옵션 기재"
                  />
                </OptionInputWrapper>
                </>
              )}
                </ProductDetails>
              </ProductInfo> 

              <ProductPrice>{formatPrice(product.productPrice)}</ProductPrice>
              
          <QuantityWrapper>
            <QuantityButton onClick={() => handleDecreaseQuantity(product.id, product.selectOption, product.quantity)}>-</QuantityButton>
            <QuantityInput
              type="number"
              value={product.quantity}
              onChange={(e) => handleQuantityChange(product.id, e.target.value)}  
            />
            <QuantityButton onClick={() => handleIncreaseQuantity(product.id, product.selectOption, product.quantity)}>+</QuantityButton>
          </QuantityWrapper>
              <DeleteButton onClick={() => handleDelete(product.id)}>
                <DeleteIcon src={Delete} />
              </DeleteButton>
            </ProductItem>
          ))}
        </LeftSection>
        <LeftSection>
          <OrderTitle>주문 금액</OrderTitle>
          <PriceDetail>
            <span>총 상품 금액</span>
            <span>{formatPrice(totalPrice)}</span>
          </PriceDetail>
          <PriceDetail>
            <span>선택한 상품 금액</span>
            <span style={{ color: 'red' }}>{formatPrice(selectedTotalPrice)}</span>
          </PriceDetail>
          <ConfirmButton onClick={handlePurchase}>구매하기</ConfirmButton>
        </LeftSection>

      </OrderPageWrapper>
    </>
  );
};

export default Cart;

export const Div = styled.div`
  width: 100%;
  min-height: 160px;
  border: none;
  @media (max-width: 780px) {
    max-height: 4vh;
    min-height: 6vh;
  }
`;

export const OrderPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  margin: 2% auto;

  @media (max-width: 1024px) {
    flex-direction: column;
    width: 90%;
  }
`;

export const LeftSection = styled.div`
  width: 60%;
  padding: 5px;
  margin: 0 auto;
  padding: 5px;
  margin: 0 auto;
  @media (max-width: 1024px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

export const DeleteIcon = styled.img`
  max-width: 20px;

  @media (max-width: 780px) {
    max-width: 15px;
  }
`;

export const RightSection = styled.div`
  width: 35%;
  background-color: #fff;
  padding: 2%;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    width: 100%;
    padding: 5.5%;
  }
`;

export const OrderTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  max-width: 100%;
  position: relative; 
  border-bottom: 1px solid #e0e0e0;

  @media (max-width: 780px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
export const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  width: 70%;
`;

export const ProductImage = styled.img`
  max-width: 100px;
  max-width: 100px;
  width: 100px;
  min-width: 100px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover; 
  margin-right: 20px;
`;

export const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;

  select {
    padding: 10px 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    background-color: white;
    margin-top: 10px;
    outline: none;
    transition: border-color 0.3s ease;
    width: 80%;

    &:focus {
      border-color: #4d44b5;
    }
  }

  @media (max-width: 780px) {
    flex-grow: 1;
    select {
      width: 100%;
    }
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const ProductName = styled.span`
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 6px;
`;

export const ProductModel = styled.span`
  color: #111;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

export const ProductColor = styled.span`
  font-size: 1rem;
  color: #666;
  margin-top: 4px;
`;

export const ProductPrice = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  white-space: nowrap;

  @media (max-width: 780px) {
    width: 100%;
    margin-bottom: 10px;
  }
`;

export const QuantityButton = styled.button`
  background-color: #eee;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;

export const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100px;

  @media (max-width: 780px) {
    width: 20%; 
    justify-content: space-between; 
  }
`;

export const QuantityInput = styled.input`
  width: 40px;
  text-align: center;
  @media(max-width: 780px){
    width: 30px;
  }
`;


export const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: red;
  font-size: 1.3rem;
  position: absolute; 
  top: 10px;
  right: 10px; 
  transition: color 0.3s ease, transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    color: #ff4d4d;
    background-color: rgba(255, 77, 77, 0.1); 
  }

  @media (max-width: 780px) {
    top: 20px; 
    right: 5px;
  }
`;


export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  white-space: nowrap;
`;

export const CheckboxLabel = styled.label`
  font-size: 1.5rem;
  cursor: pointer;
  @media (max-width: 800px) {
    font-size: 1.1rem;
  }
`;

export const Checkbox = styled.input`
  margin-right: 6px;
  margin-top: 6px;
  width: 15px;
  border: 1px solid #ddd;
  height: 15px;
  cursor: pointer;
  border-radius: 8px;
  &:checked {
    background-color: #4d44b5;
  }
  @media (max-width: 800px) {
    width: 20px;
    height: 20px;
    border-radius: 5px;
  }
`;

export const PriceDetailsWrapper = styled.div`
  padding: 15px 0;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid #dcdcdc;
  margin-top: 4%;
  input{
    width: 77%;
    padding: 9px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  button{
    padding: 9px 20px;
    background-color: #000;
    color: #fff;
    width: 19%;
    border-radius: 5px;
    text-align: center;
  }
  p{
    white-space: nowrap;
    margin: 1%;
    text-align: center;
  }
`;

export const PriceDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3%;
  span{
    font-size: 1.4rem;
    @media(max-width: 780px){
      font-size: 1.3rem;
    }
  }
`;

export const TotalPrice = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
`;

export const ConfirmButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: rgba(77, 68, 181, 0.3);
  color: #4D44B5;
  border: none;
  font-weight: bold;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 2%;
  &:hover {
    background-color: rgba(77, 68, 181, 0.6);  
    color: #fff;    
  }
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  width: 45%;
  padding: 20px 0;
  margin: 0 auto;
  align-items: center;
  @media (max-width: 780px) {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 5%;
  }

  h1 {
    font-size: 2.3rem;
    font-weight: bold;

    @media (max-width: 780px) {
      font-size: 1.9rem;
    }
  }
`;

export const OptionInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 80%;
  margin-top: 5px;

  input {
    width: 100%;
    padding: 10px 5px;
    border: 1px solid #ddd !important; 
    border-radius: 5px;
    font-size: 1rem;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.3s ease;

    &:hover {
      border-color: #4d44b5 !important;
    }

    &:focus {
      border-color: #4d44b5 !important; 
    }
  }
  @media(max-width: 780px){
    width: 100%;
  }
`;
