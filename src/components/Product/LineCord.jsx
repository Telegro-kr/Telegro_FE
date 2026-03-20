import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import image from './image.svg';
import Pagination from '../Pagination/Pagination';
import * as P from './ProductStyle';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';


const LineCord = ({ category = 'LINE_CORD',initialPage = 1, size = 12 }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const pagesPerGroup = 5; 
  const startPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleGroupChange = (direction) => {
    if (direction === 'prev' && startPage > 1) {
      setCurrentPage(startPage - 1);
    } else if (direction === 'next' && endPage < totalPages) {
      setCurrentPage(endPage + 1);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`, {
          params: { category, page: currentPage - 1, size },
        });
  
        const productsData = response.data.data.products;
        const productsArray = Array.isArray(productsData) ? productsData : Object.values(productsData);
        const sortedProducts = productsArray.sort((a, b) => b.id - a.id);
  
        setProducts(sortedProducts);
  
        setTimeout(() => {
          console.log('Products after state update:', products);
        }, 0);
  
        setTotalPages(response.data.data.totalPage); 
      } catch (error) {
        setError(`Failed to load products: ${error.message}`);
      }
    };
  
    fetchProducts();
  }, [category, currentPage, size]);


  if (error) {
    return <div>{error}</div>;  
  }
  function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
}


  return (
    <>
      <P.Div />
      <P.Inline>
        <h1>라인코드</h1>
        {/*<p>sorted</p>*/}
      </P.Inline>
      <P.GalleryGrid>
        {products.map((product) => (
          <P.GalleryItem key={product.id} onClick={() => navigate(`/productdetail/${product.id}`)}>
            <img src={product.coverImage || image} alt={product.name} />
            <h3>{product.productName}</h3>
            <p>{product.productModel}</p>
            <strong>{formatPrice(product.price)}</strong>
          </P.GalleryItem>
        ))}
      </P.GalleryGrid>
      <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      startPage={startPage}
      endPage={endPage}
      onPageChange={handlePageChange}
      onGroupChange={handleGroupChange}
      />
    </>
  );
};

export default LineCord;
