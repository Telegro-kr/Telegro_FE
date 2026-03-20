import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Pagination from '../Pagination/Pagination';
import * as N from '../Notice/NoticeStyle';
import * as R from './OrderManagerStyle';
import * as O from '../OrderProcess/OrderProcessStyle';
import { FaSearch } from 'react-icons/fa';
import { formatDate } from '../../utils/format';
import { orderStatusMap } from '../../constants/orderStatus';
import Form from 'react-bootstrap/Form';
import { API_BASE_URL } from '../../constants/api';

const OrderManager = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const pagesPerGroup = 5;
  const startPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const handleCancelRequest = async (orderId) => {
    const accessToken = localStorage.getItem("token");
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/payments/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.code === 20000) {
        alert("결제가 성공적으로 취소되었습니다.");
        const updatedOrders = orders.map((order) =>
          order.orderId === orderId ? { ...order, orderStatus: "CANCELED" } : order
        );
        setOrders(updatedOrders);
      } else {
        alert(`결제 취소 요청에 실패했습니다: ${response.data.message}`);
      }
    } catch (error) {
      console.error("결제 취소 요청 중 오류 발생:", error);
      alert("결제 취소 요청 중 오류가 발생했습니다.");
    }
  };
  
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          params: {
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            size: 10000,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        const { data } = response.data;
        setAllOrders(data.orders || []);
        setTotalPrice(data.totalPrice);
      } catch (error) {
        console.error('전체 주문 목록 불러오기 실패:', error);
        setAllOrders([]);
      }
    };
    fetchAllOrders();
  }, [startDate, endDate]);
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const paginatedResponse = await axios.get(`${API_BASE_URL}/api/orders`, {
          params: {
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            page: currentPage - 1,
            size,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { data: paginatedData } = paginatedResponse.data;
        setOrders(paginatedData.orders || []);
        setTotalPages(paginatedData.totalPage || 0);
      } catch {
        setOrders([]);
      }
    };

    fetchOrders();
  }, [startDate, endDate, currentPage, size]);

  useEffect(() => {
    const applySearchFilter = () => {
      if (!searchValue) {
        setFilteredOrders(orders);
      } else {
        const filtered = orders.filter(order =>
          order.products.some(product =>
            product.productName.toLowerCase().includes(searchValue.toLowerCase())
          )
        );
        setFilteredOrders(filtered);
      }
    };

    applySearchFilter();
  }, [searchValue, orders]);

  useEffect(() => {
    const fetchSearchOrders = async () => {
      if (!searchValue) {
        setIsSearching(false);
        return;
      }
  
      setIsSearching(true);
      try {
        const accessToken = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          params: {
            q: searchValue,
            filterBy: 'product',
            size: 10000,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        const { data: searchData } = response.data;
        setFilteredOrders(searchData.orders || []);
        setTotalPages(1);
        setTotalPrice(searchData.totalPrice);
      } catch (error) {
        console.error('Error fetching search orders:', error);
        setFilteredOrders([]);
      }
    };
  
    fetchSearchOrders();
  }, [searchValue, startDate, endDate]);

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

  return (
    <R.MainWrapper>
      <O.Div />
      <R.Title>주문확인</R.Title>
      <R.SearchSection>
        <div>
          <label>기간: </label>
          <R.DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          -
          <R.DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <N.SearchWrap style={{ marginLeft: '20%' }}>
          <N.StyledForm onSubmit={(e) => e.preventDefault()}>
            <Form.Control
              type="text"
              placeholder="주문명 검색"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <N.StyledButton type="submit" variant="none">
              <FaSearch size={15} />
            </N.StyledButton>
          </N.StyledForm>
        </N.SearchWrap>
      </R.SearchSection>

      <OrderTable>
        <TableHead>
          <tr>
            <TableCell>No</TableCell>
            <TableCell>상품명</TableCell>
            <TableCell>옵션 선택</TableCell>
            <TableCell>수량</TableCell>
            <TableCell>단가</TableCell>
            <TableCell>총 금액</TableCell>
            <TableCell>주문정보</TableCell>
            <TableCell>주문 상태</TableCell>
          </tr>
        </TableHead>
        <tbody>
        {(searchValue ? filteredOrders : orders).length > 0 ? (
          (searchValue ? filteredOrders : orders)
          .filter((order) => order.products && order.products.length > 0)
          .map((order, index) => (
            <React.Fragment key={order.orderId}>
              {order.products?.length > 0 ? (
                order.products.map((product, productIndex) => (
                  <TableRow
                    onClick={() => navigate(`/ordermanager/${order.orderId}`)}
                    className={`order-${order.orderId} ${productIndex === 0 ? 'highlight-row' : ''}`}
                    key={product.id || `${order.orderId}-${productIndex}`}
                  >
                    {productIndex === 0 && (
                      <TableCell rowSpan={order.products.length}>
                        {index + 1 + (currentPage - 1) * size}
                      </TableCell>
                    )}
                    <TableCell>
                      <p>{product.productName || '상품 정보 없음'}</p>
                    </TableCell>
                    <TableCell>{product.selectOption || 'N/A'}</TableCell>
                    <TableCell>{product.quantity || 0}</TableCell>
                    <TableCell>{`${(product.productPrice || 0).toLocaleString()}원`}</TableCell>
                    <TableCell>{`${(product.totalPrice || 0).toLocaleString()}원`}
                    {order.shoppingCost === 0 && (
                    <>
                      <br />
                      (무료 배송)
                    </>
                  )}
                  {order.shoppingCost === 3000 && (
                    <>
                      <br />
                      (일반 배송)
                    </>
                  )}
                  {order.shoppingCost === 4000 && (
                    <>
                      <br />
                      (위탁 배송)
                    </>
                  )}
                    </TableCell>
                    {productIndex === 0 && (
                      <>
                        <TableCell rowSpan={order.products.length}>{formatDate(order.createdAt)}</TableCell>
                        <TableCell
                          onClick={(e) => e.stopPropagation()}
                          rowSpan={order.products.length}
                        >
                          <div>
                            <span>{orderStatusMap[order.orderStatus] || order.orderStatus}</span>
                            {(order.orderStatus === "ORDER_CREATE" ||
                              order.orderStatus === "PAYMENT_COMPLETED" ||
                              order.orderStatus === "ORDER_COMPLETED") && (
                              <>
                                <br />
                                <R.CancelButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelRequest(order.orderId);
                                  }}
                                >
                                  취소 요청
                                </R.CancelButton>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>상품 정보가 없습니다.</TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
        ) : (
          <tr>
            <TableCell colSpan={8}>주문 데이터가 없습니다.</TableCell>
          </tr>
        )}
      </tbody>
      </OrderTable>
      <R.TotalAmount>
        총 주문 금액(VAT 별도): ₩{totalPrice.toLocaleString()}
      </R.TotalAmount>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startPage={startPage}
        endPage={endPage}
        onPageChange={handlePageChange}
        onGroupChange={handleGroupChange}
      />
    </R.MainWrapper>
  );
};

export default OrderManager;

export const SearchWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin-left: 20%;
  width: 100%;
  max-width: 350px;
  align-items: center;

  @media (max-width: 780px) {
    justify-content: center;
    margin-right: 0;
    margin-top: 2%;
    max-width: 250px;
    width: 90%;
  }
`;

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 1rem;

  th, td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
    vertical-align: middle;
  }

  th {
    background-color: #f0f0f0;
    font-weight: bold;
  }

  @media (max-width: 780px) {
    th, td {
      padding: 8px;
    }
  }
`;

const TableHead = styled.thead`
  background-color: #f0f0f0;
  font-weight: bold;
  text-align: left;
`;

const TableRow = styled.tr`
  cursor: pointer;
`;

const TableCell = styled.td`
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  vertical-align: middle;
`;
