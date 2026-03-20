import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Pagination from '../Pagination/Pagination';
import * as P from './ProductList/ProductStyle';
import * as N from './Notice/NoticeStyle';
import { FaSearch, FaFileExcel } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from '../../constants/api';

const OrderList = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); 
  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchCategory, setSearchCategory] = useState('productName');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  const pagesPerGroup = 5; 
  const [allOrders, setAllOrders] = useState([]); 
  const startPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const getStatusLabel = (status) => {
    switch (status) {
      case 'ORDER_CREATED':
        return '주문 생성';
      case 'PAYMENT_COMPLETED':
        return '결제 완료';
      case 'ORDER_COMPLETED':
        return '주문 완료';
      case 'SHIPPING':
        return '배송 중';
      case 'DELIVERY_COMPLETED':
        return '배송 완료';
      case 'ORDER_CANCELLED':
        return '주문 취소됨';
      default:
        return '알 수 없는 상태';
    }
  };
  
  const getIamportToken = async () => {
    try {
      const response = await axios.post("https://api.iamport.kr/users/getToken", {
        imp_key: "7540428574040455",
        imp_secret: "N3gflhvzjeD6LRRMTqOLJRCYn3HyJgoBjpkZk6JQJY8c0jPtXjS0wRVvmR5eAJLm8ezBWUnxXIoNH6j9",
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
  
      if (response.data.code === 0) {
        return response.data.response.access_token;
      } else {
        console.error("토큰 발급 실패:", response.data.message);
      }
    } catch (error) {
      console.error("토큰 발급 중 오류 발생:", error);
    }
    return null;
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
      } catch (error) {
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
    const fetchAllOrders = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          params: {
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            size: 10000, // 모든 주문 가져오기
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        const { data } = response.data;
        setAllOrders(data.orders || []);
        setTotalPrice(data.totalPrice);
      } catch (error) {
        setAllOrders([]);
      }
    };
  
    fetchAllOrders();
  }, [startDate, endDate]);

  const fetchSearchOrders = async () => {
    if (!searchValue && !startDate && !endDate) {
      setIsSearching(false); 
      return;
    }
  
    setIsSearching(true);
    try {
      const accessToken = localStorage.getItem('token');
      const filterBy = searchCategory === 'productName' ? 'product' : 'user';
  
      const response = await axios.get(`${API_BASE_URL}/api/orders`, {
        params: {
          q: searchValue || undefined,
          filterBy, 
          size: 10000,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const { data: searchData } = response.data;
      setFilteredOrders(searchData.orders || []);
      setTotalPages(1); 
      setTotalPrice(searchData.totalPrice || 0); // 수정된 부분
    } catch {
      setFilteredOrders([]);
    } finally {
      setIsSearching(false); 
    }
  };
  
  useEffect(() => {
    fetchSearchOrders();
  }, [searchValue, searchCategory, startDate, endDate]);
  

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    const selectedOrder = orders.find(order => order.orderId === orderId);
  
    if (selectedOrder?.orderStatus === 'ORDER_CANCELLED') {
      alert('취소된 주문은 상태를 변경할 수 없습니다.');
      return;
    }
  
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/orders/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            status: newStatus,
          },
        }
      );
  
      if (response.data.code === 20000) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        alert('주문 상태가 변경되었습니다.');
      } else {
        alert('주문 상태 변경에 실패했습니다.');
      }
    } catch {
      alert('주문 상태 변경 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const applySearchFilter = () => {
      if (!searchValue && !startDate && !endDate) {
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
  }, [searchValue, orders, startDate, endDate]);
  
  
  const exportToExcel = () => {
    let exportData;
  
    if (searchValue || startDate || endDate || isSearching) {

      exportData = filteredOrders;
    } else {
      exportData = allOrders;
    }
  
    if (!exportData || exportData.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
  
    const excelData = exportData.map((order, index) => {
      return order.products.map((product) => ({
        'No': index + 1,
        '주문번호': order.orderId,
        '수령인 이름': order.deliveryAddress?.recipientName || '정보 없음',
        '전화번호': order.deliveryAddress?.phoneNumber || '정보 없음',
        '주소': order.deliveryAddress?.address || '정보 없음',
        '상세 주소/우편번호': `${order.deliveryAddress?.addressDetail || '정보 없음'} / ${order.deliveryAddress?.zipcode || '정보 없음'}`,
        '상품명': product.productName || '정보 없음',
        '상품 수량': product.quantity || 0,
        '상품 옵션': product.selectOption || 'N/A',
        '상품 단가': `${product.productPrice}원`,
        '총 금액': `${product.totalPrice}원`,
        '주문 상태': order.orderStatus,
        '주문 일자': formatDate(order.createdAt),
        '요청 사항': order.request,
      }));
    }).flat();
  
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, searchValue || startDate || endDate ? '검색_주문목록' : '전체_주문목록');
  
    const fileName = searchValue || startDate || endDate
      ? `검색_주문목록_${new Date().toISOString().slice(0, 10)}.xlsx`
      : `전체_주문목록_${new Date().toISOString().slice(0, 10)}.xlsx`;
  
    XLSX.writeFile(workbook, fileName);
  };
  
  
  
  
    
  return (
    <>
      <MainWrapper>
        <Title>주문확인</Title>
        <SearchSection style={{whiteSpace: 'nowrap'}}>
          <div>
            <label>기간: </label>
            <DateInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            /> - 
            <DateInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <SearchWrap>
            <SelectBar
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="productName">상품명</option>
              <option value="customer">주문자 정보</option>
            </SelectBar>
            <N.StyledForm onSubmit={(e) => e.preventDefault()}>
              <Form.Control
                type="text"
                placeholder="검색어 입력"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <N.StyledButton type="submit"><FaSearch size={15} /></N.StyledButton>
            </N.StyledForm>
          </SearchWrap>
        </SearchSection>

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
              <TableCell>주문자 정보</TableCell>
              <TableCell>주문 상태</TableCell>
            </tr>
          </TableHead>
          <tbody>
          {filteredOrders.map((order, index) => (
            <React.Fragment key={order.orderId}>
              {order.products.map((product, productIndex) => (
                <TableRow onClick={() => navigate(`/admin/orderlist/${order.orderId}`)} className={`order-${order.orderId} ${productIndex === 0 ? 'highlight-row' : ''}`} key={product.id}>
                  {productIndex === 0 && (
                    <TableCell rowSpan={order.products.length}>
                      {index + 1 + (currentPage - 1) * size}
                    </TableCell>
                  )}
                  <TableCell>
                    <p>{product.productName}</p>
                  </TableCell>
                  <TableCell>{product.selectOption || 'N/A'}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{`${(product.productPrice).toLocaleString()}원`}</TableCell>
                  <TableCell>{`${(product.totalPrice + (productIndex === 0 ? order.shoppingCost : 0)).toLocaleString()}원`}
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
                      <TableCell rowSpan={order.products.length}>
                        <p style={{fontWeight: 'bold', marginBottom: '3px'}}>{order.userInfo.username}</p>
                        <small>{order.deliveryAddress.address}</small>
                        <br/>
                        <small>{order.deliveryAddress.addressDetail}({order.deliveryAddress.zipcode})</small>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}  rowSpan={order.products.length}>
                        {order.orderStatus === 'ORDER_CANCELLED' ? (
                          <>
                            <p style={{ color: 'red' }}>주문 취소됨</p>
                          </>
                        ) : (
                          <StatusSelect
                          value={order.orderStatus}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        >
                          {/* 현재 상태는 항상 첫 번째 옵션으로 표시 */}
                          <option value={order.orderStatus}>
                            {getStatusLabel(order.orderStatus)}
                          </option>
                    
                          {/* 선택 가능한 옵션: 배송 중, 배송 완료 */}
                          <option value="SHIPPING">배송 중</option>
                          <option value="DELIVERY_COMPLETED">배송 완료</option>
                        </StatusSelect>
                        )}
                        {order.orderStatus === 'ORDER_CANCELLED' ? (
                          <>
                            
                          </>
                        ) : (
                          <>
                            <br />
                            <CancelButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelRequest(order.orderId, order.impUid, '고객 요청', {
                                  holder: '예금주 이름',
                                  bankCode: '은행 코드',
                                  account: '환불 계좌 번호',
                                });
                              }}
                            >
                              취소 요청
                            </CancelButton>
                            </>)}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
          </tbody>
        </OrderTable>
        <TotalAmount>
          총 주문 금액(VAT 별도): ₩{totalPrice.toLocaleString()}
        </TotalAmount>
        <StyledButton onClick={exportToExcel} style={{ padding: '10px', margin: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          <FaFileExcel style={{ marginRight: "8px" }} /> 엑셀 다운로드
        </StyledButton>
      </MainWrapper>


      <P.Pagediv>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startPage={startPage}
            endPage={endPage}
            onPageChange={handlePageChange}
            onGroupChange={handleGroupChange}
          />
      </P.Pagediv>
    </>
  );
};

export default OrderList;
const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #34a853, #0a8f08);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(90deg, #0a8f08, #34a853);
    transform: scale(1.05);
  }

  &:active {
    background: #0a8f08;
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
  }
`;

const MainWrapper = styled.div`
  width: 70%; 
  margin-left: 280px;
  margin-top: 5%;
  @media(max-width: 780px){
    width: 100%; 
    margin: 5% 1%;
  }
`;

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

const Title = styled.h2`
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 20px;
  @media(max-width: 780px){
    font-size: 1.9rem;
    margin-top: 10%;
  }
`;

const SearchSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media(max-width: 780px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DateInput = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: auto;

  @media(max-width: 780px) {
    max-width: 700px;
    width: 70%;
  }
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
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


const StatusSelect = styled.select`
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TotalAmount = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: right;
`;

const SelectBar = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
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

const CancelButton = styled.button`
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #ff4d4d;
  }
`;
