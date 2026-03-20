import { FaEdit, FaTrash } from 'react-icons/fa'; 
import React, { useState, useEffect } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import styled from 'styled-components';
import img from '../../Check/image.svg'; 
import * as N from '../Notice/NoticeStyle';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { API_BASE_URL } from '../../../constants/api';

const AdminProductDetail = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { productId } = useParams(); 
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${productId}`,{
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

  function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
}

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 상품을 삭제하시겠습니까?");
    
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        if (response.status === 200 && response.data.code === 20000) {
          alert('상품이 성공적으로 삭제되었습니다.');
  
          // 카테고리에 따라 페이지 이동
          switch (product.category) {
            case 'HEADSET':
              navigate('/admin/headset');
              break;
            case 'LINE_CORD':
              navigate('/admin/linecord');
              break;
            case 'ACCESSORY':
              navigate('/admin/accessory');
              break;
            case 'RECORDER':
              navigate('/admin/recording');
              break;
            default:
              navigate('/admin/headset');  
              break;
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError('관리자 계정으로 로그인되지 않았습니다.');
        } else {
          setError('상품을 삭제하는 동안 오류가 발생했습니다.');
        }
      }
    }
  };
  
  if (!product) {
    return <div>로딩 중...</div>; 
  }

  return (
    <>
      <MainWrapper>

          <N.PageTitle style={{ margin: '0', padding: '0' }}>
            <h2>제품 상세</h2>
          </N.PageTitle>

          <div>
            <FaEdit
              onClick={() => navigate(`/admin/adminproductedit/${productId}`)}
              style={{ cursor: 'pointer', marginRight: '10px', fontSize: '24px', color: '#4D44B5' }}
            />
            <FaTrash
              onClick={handleDelete}
              style={{ cursor: 'pointer', fontSize: '24px', color: '#E53E3E' }}
            />
          </div>

      </MainWrapper>
      <ProductPageWrapper>
        <ProductDetails>
          <ProductInfoWrapper>
            <ProductImage src={product.pictures[0] || img} alt="Main Product" /> {/* 메인 이미지 표시 */}
            <ProductInfo>
              <ProductTitle>{product.productName}</ProductTitle> {/* 상품명 */}
              <ProductSubtitle>{product.productModel}</ProductSubtitle> {/* 모델명 */}
            </ProductInfo>
          </ProductInfoWrapper>
          <AdditionalImagesWrapper>
            {product.pictures.slice(1).map((picture, index) => (
              <AdditionalImage
                style={{cursor: 'pointer'}}
                key={index}
                src={picture}
                alt={`Additional Image ${index + 1}`}
                onClick={() => openModal(index)} />
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
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)'},
              }}
            >
        <LeftArrow onClick={prevImage}>&lt;</LeftArrow>
        <ModalImage src={product.pictures[currentImageIndex]} style={{cursor: 'pointer'}} onClick={closeModal} alt="Modal" />
        <RightArrow onClick={nextImage}>&gt;</RightArrow>
      </Modal>
          </AdditionalImagesWrapper>
        </ProductDetails>
        <div style={{display: 'flex', justifyContent: 'flex-start', margin: '0 auto', width: '90%'}}>
          <DescriptionTitle style={{ textAlign: 'left', marginBottom: '20px', alignItems: 'center' }}>가격</DescriptionTitle>
          </div>
        <PriceWrapper>
          <PriceListWrapper>
            <PriceTag>business: {formatPrice(product.priceBussiness)}</PriceTag>
            <PriceTag>best: {formatPrice(product.priceBest)}</PriceTag>
            <PriceTag>dealer: {formatPrice(product.priceDealer)}</PriceTag>
            <PriceTag>customer: {formatPrice(product.priceCustomer)}</PriceTag>
          </PriceListWrapper>
        </PriceWrapper>
        <ContentWrapper>
            <DescriptionTitle>상품 설명</DescriptionTitle>
            <DescriptionList> 
              <DescriptionItem className="toastui-editor-contents" dangerouslySetInnerHTML={{ __html: product.content }} /> {/* 상품 설명 */}
            </DescriptionList>

        </ContentWrapper>
      </ProductPageWrapper>
    </>
  );
};

export default AdminProductDetail;


const ProductPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2%;
  width: 70%;
  margin-left: 23%;
  margin-top: 3vh;
  padding: 2%;
  margin-bottom: 4%;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  @media(max-width: 780px){
    width: 90%;
    margin: 0 auto;
  }
`;

const ProductDetails = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 2%;
  border-radius: 10px;
  margin-bottom: 40px;
  @media(max-width: 780px){
    flex-direction: column;
  }
`;

const ProductInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
`;
const ModalImage = styled.img`
  width: 50%;
  height: auto;
  margin-left: 270px;
  max-height: 80vh;
  object-fit: contain;  
  @media(max-width: 780px){
    width: 80%;
    margin: auto;
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 2rem;
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const LeftArrow = styled(ArrowButton)`
  left: 270px;
  @media(max-width: 780px){
    left: 5%;
  }
`;

const RightArrow = styled(ArrowButton)`
  right: 25px;
  @media(max-width: 780px){
    right: 5%;
  }
`;

const ProductImage = styled.img`
  width: 250px;
  height: auto;
  margin-right: 30px;
  @media(max-width: 780px){
    width: 100px;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProductTitle = styled.h2`
  font-weight: bold;
  font-size: 2rem;
  white-space: nowrap;
  color: #303972;
  margin-bottom: 10px;
  margin-left: 6%;
`;

const ProductSubtitle = styled.h3`
  font-weight: bold;
  font-size: 1.6rem;
  color: #6B6B6B;
  margin-bottom: 35%;
  margin-left: 8%;
`;

const PriceWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 90%;
  margin: 0 auto;
  h1{
    font-size: 1.4rem;
  }
  @media(max-width: 780px){
    flex-direction: column;
    text-align: left;
    width: 100%;
  }
`;

const PriceListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 90%;
  margin-bottom: 20px;
  h1{
    font-size: 1.4rem;
  }
  @media(max-width: 780px){
    grid-template-columns: repeat(2, 1fr);
    margin-top: 20px;
  }
`;

const PriceTag = styled.span`
  padding: 5px 15px;
  background: rgba(77, 68, 181, 0.2);
  border-radius: 1rem;
  align-items: center;
  color: #444;
  font-weight: semibold;
  font-size: 1.3rem;
`;

const AdditionalImagesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 5px;
  column-gap: 10px; 
  padding-left: 20px;
  align-items: center;
  justify-items: center;
  height: 29.5vh;
  margin: 5% 0;
  @media(max-width: 780px){
    grid-template-columns: repeat(4, 1fr);
  }
`;

const AdditionalImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid #d3d3d3;
  object-fit: cover; 
`;

  const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 90%;
  margin: 0 auto;
  padding-bottom: 5%;
  padding-top: 5%;
`;

const DescriptionTitle = styled.h4`
  font-size: 1.6rem;
  white-space: nowrap;
  color: #303972;
  font-weight: bold;
  margin-bottom: 10px;
`;

const DescriptionList = styled.ul`
  list-style-type: none;
  margin-top: 2%;
  padding: 0;
  font-size: 1.4rem;
  line-height: 1.7;
  color: #444;
  position: relative;
`;

const DescriptionItem = styled.li`
  margin-bottom: 5px;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  img {
    width: 100%;
    margin: 0 auto;
    height: auto;
    object-fit: contain; /* 이미지를 비율에 맞게 축소 */
  }
`;

const MainWrapper = styled.div`
  width: 70%; 
  margin: 0 auto 0 280px; 
  padding: 2%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 70%; 
  @media(max-width: 780px){
    margin: 0 auto;
  }
`;