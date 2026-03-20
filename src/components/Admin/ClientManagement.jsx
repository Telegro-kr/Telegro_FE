import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import AddClient from '/src/assets/icon/Admin/addclient.svg';
import * as N from './Notice/NoticeStyle';
import Pagination from '../Pagination/Pagination';
import * as P from './ProductList/ProductStyle';
import { API_BASE_URL } from '../../constants/api';
const roleColors = {
  MEMBER: { background: '#D8EBFF', color: '#007BFF' }, 
  DEALER: { background: '#E8F5E9', color: '#4CAF50' }, 
  BEST: { background: '#FFF3E0', color: '#FB8C00' },
  BUSINESS: { background: '#FFEBEE', color: '#D32F2F' },
  ADMIN: { background: '#EDE7F6', color: '#7E57C2' } 
};
const RoleTag = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ role }) => roleColors[role]?.background || '#F0F0F0'};
  color: ${({ role }) => roleColors[role]?.color || '#333'};
  padding: 0.2rem 0.6rem;
  border-radius: 1.5rem;
  font-size: 0.9rem;
  font-weight: bold;
  white-space: nowrap;
`;

const Dot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: ${({ role }) => roleColors[role]?.color || '#333'};
  border-radius: 50%;
  margin-right: 0.5rem;
`;
const MainWrapper = styled.div`
  width: 95%;
  margin: 5% auto;
  padding: 1%;
  @media(max-width: 780px) {
    margin-left: 0px;
    margin-top: 7vh;
  }
`;

const Div = styled.div`
  margin-left: 270px;
  @media(max-width: 780px) {
    margin-left: 0px;
    margin-top: 7vh;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  margin-top: 3%;
`;

const TableHead = styled.thead`
  background-color: #f9f9f9;
  white-space: nowrap;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
  &:nth-child(even) {
    background-color: #FCFCFD;
  }
  &:hover {
    background-color: #ececec;
  }
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: bold;
  @media(max-width: 780px) {
    &:nth-child(4), &:nth-child(6), &:nth-child(7) {
      display: none;
    }
  }
`;

const TableData = styled.td`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  @media(max-width: 780px) {
    &:nth-child(4), &:nth-child(6), &:nth-child(7) {
      display: none;
    }
  }
`;

const TableDataName = styled.td`
  padding: 12px;
  text-align: left;
  cursor: pointer;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  font-size: 1.05rem;

  @media(max-width: 780px) {
    &:nth-child(4), &:nth-child(6), &:nth-child(7) {
      display: none;
    }
  }
  &:hover {
    color: blue;
    text-decoration: underline; 
  }
`;


const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #4d44b5;
  &:hover {
    color: #3b3a9d;
  }
`;

const Add = styled.img`
  width: 3.5rem;
  height: 3rem;
  cursor: pointer;
  align-items: center;
  @media(max-width: 780px){
    max-width: 2.7rem;
    max-height: 2.3rem;
  }
`;

const ClientManagement = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]); 
  const [roleFilter, setRoleFilter] = useState(''); 
  const [filteredClients, setFilteredClients] = useState([]);
  const pageSize = 20; 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); 
  const pagesPerGroup = 5; 
  const startPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  const [error, setError] = useState('');
  const handleGroupChange = (direction) => {
    if (direction === 'prev' && startPage > 1) {
      setCurrentPage(startPage - 1);
    } else if (direction === 'next' && endPage < totalPages) {
      setCurrentPage(endPage + 1);
    }
  };
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const params = {
          page: currentPage - 1,
          size: pageSize,
        };

        const response = await axios.get(`${API_BASE_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: params,
        });

        if (response.status === 200) {
          setClients(response.data.data.users);
          setTotalPages(response.data.data.totalPage);
        } else {
          alert('사용자 데이터를 불러오는 데 실패했습니다.');
        }
      } catch {
        alert('사용자 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchClients();
  }, [currentPage]);


  useEffect(() => {
    if (roleFilter) {
      const filtered = clients.filter(client => client.role === roleFilter);
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [roleFilter, clients]);

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); 
  };

  const handleDelete = async (clientId) => {
    const confirmDelete = window.confirm('정말 이 회원을 삭제하시겠습니까?'); 
    if (!confirmDelete) {
      return;
    }
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/users/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        alert('회원이 성공적으로 삭제되었습니다.');
        setClients(clients.filter(client => client.id !== clientId));
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert('유저 인증 실패: 다시 로그인해 주세요.');
          navigate('/admin');
        } else if (error.response.status === 404) {
          alert('해당 리소스를 찾을 수 없습니다.');
        } else {
          alert('서버 오류가 발생했습니다.');
        }
      } else {
        alert('네트워크 오류가 발생했습니다.');
      }
    }
  };

  return (
    <>
      <Div>
        <MainWrapper>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <N.PageTitle style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '7px'}}>
              <h2>고객 관리</h2>
              <Add onClick={() => navigate('/admin/addclient')} src={AddClient} />
            </N.PageTitle>
            <div>
              <select value={roleFilter} onChange={handleRoleChange}>
                <option value="">전체</option>
                <option value="MEMBER">MEMBER</option>
                <option value="DEALER">DEALER</option>
                <option value="BEST">BEST</option>
                <option value="BUSINESS">BUSINESS</option>
              </select>
            </div>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>No</TableHeader>
                <TableHeader>단가</TableHeader>
                <TableHeader>이름</TableHeader>
                <TableHeader>전화번호</TableHeader>
                <TableHeader>이메일</TableHeader>
                <TableHeader>아이디</TableHeader>
                <TableHeader>가입일</TableHeader>
                <TableHeader>총 주문액(적립금)</TableHeader>
                <TableHeader>수정</TableHeader>
                <TableHeader>삭제</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client, index) => (
                  <TableRow key={client.id}>
                    <TableData>{index + 1}</TableData>
                    <TableData>
                      <RoleTag role={client.role}>
                        <Dot role={client.role} />
                        {client.role}
                      </RoleTag>
                    </TableData>
                    <TableDataName onClick={() => navigate(`/admin/ClientDetail/${client.id}`)}>{client.userName}</TableDataName>
                    <TableData>{client.phone}</TableData>
                    <TableData>{client.email}</TableData>
                    <TableData>{client.userId}</TableData>
                    <TableData>{new Date(client.createdDate).toLocaleDateString()}</TableData>
                    <TableData>{`\₩${client.totalPrice.toLocaleString()} (\₩${Math.floor(client.point).toLocaleString()})`}</TableData>
                    <TableData>
                      <IconButton onClick={() => navigate(`/admin/ClientEdit/${client.id}`)}><FaPencilAlt /></IconButton>
                    </TableData>
                    <TableData>
                      <IconButton onClick={() => handleDelete(client.id)}><FaTrash /></IconButton>
                    </TableData>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableData colSpan="10">고객 데이터가 없습니다.</TableData>
                </TableRow>
              )}
            </tbody>
          </Table>
        </MainWrapper>
      </Div>
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

export default ClientManagement;
