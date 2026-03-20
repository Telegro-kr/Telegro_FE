import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import CommonTable from './CommonTable';
import CommonTableColumn from './CommonTableColumn';
import CommonTableRow from './CommonTableRow';
import * as N from './NoticeStyle';
import Pagination from '../Pagination/Pagination';
import { FaFilePdf, FaFileImage, FaFileWord, FaFileExcel, FaFile } from 'react-icons/fa';
import { API_BASE_URL } from '../../constants/api';

const Notice = ({ size = 10 }) => {
  const navigate = useNavigate();
  const [notice, setNotice] = useState([]);
  const [allNotice, setAllNotice] = useState([]);
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [filteredNotice, setFilteredNotice] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
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
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notices`, {
          params: { page: currentPage - 1, size },
        });
    
        if (response.status === 200) {
          const sortedNotices = response.data.data.notices.sort((a, b) => {
            return new Date(b.noticeCreateDate) - new Date(a.noticeCreateDate);
          });
          setNotice(sortedNotices);
          setFilteredNotice(sortedNotices); 
          setTotalPages(response.data.data.totalPage); 
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      } catch (error) {
        setError(`Failed to load products: ${error.message}`);
      }
    };
  
    fetchNotices();
  }, [currentPage, size]); 

  useEffect(() => {
    const fetchAllNotices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notices`, {
          params: { page: 0, size: 10000 }, // 모든 데이터 불러오기
        });

        if (response.status === 200) {
          const sortedNotices = response.data.data.notices.sort((a, b) => {
            return new Date(b.noticeCreateDate) - new Date(a.noticeCreateDate);
          });
          setAllNotice(sortedNotices);
          setFilteredNotice(sortedNotices);
          setTotalPages(Math.ceil(sortedNotices.length / size));
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      } catch {
        alert('오류가 발생했습니다.');
      }
    };

    fetchAllNotices();
  }, [size]);

  useEffect(() => {
    const filtered = searchValue
      ? allNotice.filter((item) =>
          item.noticeTitle.toLowerCase().includes(searchValue.toLowerCase())
        )
      : allNotice;
  
    setFilteredNotice(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / size));
  }, [searchValue, allNotice, size]);
  

  useEffect(() => {
    if (searchValue) {
      const filtered = allNotice.filter((item) =>
        item.noticeTitle.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredNotice(filtered);
      setCurrentPage(1);
      setTotalPages(Math.ceil(filtered.length / size));
    } else {
      setFilteredNotice(allNotice);
      setTotalPages(Math.ceil(allNotice.length / size));
    }
  }, [searchValue, allNotice, size]);

  if (error) {
    return <div>{error}</div>;  
  }

  const getFileIcon = (filename) => {
    if (!filename) {
      return <FaFile />; 
    }
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaFileImage />;
      case 'doc':
      case 'docx':
        return <FaFileWord />;
      case 'xlsx':
        return <FaFileExcel />;
      default:
        return <FaFile />; 
    }
  };

  

  const items = filteredNotice.map((notice, index) => (
    <CommonTableRow key={notice.id}>
      <CommonTableColumn>{filteredNotice.length - index}</CommonTableColumn> 
      <CommonTableColumn>
        <Link to={`/noticedetail/${notice.id}`}>{notice.noticeTitle}</Link>
      </CommonTableColumn>
      <CommonTableColumn>
        {getFileIcon(notice.noticeFileName)}
      </CommonTableColumn>
      <CommonTableColumn>{notice.noticeAuthor}</CommonTableColumn>
      <CommonTableColumn>{new Date(notice.noticeCreateDate).toLocaleDateString()}</CommonTableColumn>
      <CommonTableColumn>{notice.viewCount}</CommonTableColumn>
    </CommonTableRow>
  ));
  
  
  return (
    <>
    <N.MainWrapper>
    <N.Div></N.Div>
      <N.Section>
        <N.PageTitle>
          <N.TitleText>공지사항</N.TitleText>
        </N.PageTitle>
        <div style={{textAlign: 'right'}}> 총 게시물 수 : {filteredNotice.length} </div>
        <N.BoardSearchArea>
          <N.SearchWindow>
            <N.SearchWrap>
            <N.StyledForm>
                <Form.Control
                  type="text"
                  placeholder="게시글 검색"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              <N.StyledButton type="submit" variant="none"><FaSearch size={15} /></N.StyledButton>
              </N.StyledForm>
            </N.SearchWrap>
          </N.SearchWindow>
        </N.BoardSearchArea>
        <div>
          <CommonTable headersName={['No', '제목', '첨부', '작성자', '등록일', '조회수']}>{items}</CommonTable>
        </div>
      </N.Section>
    </N.MainWrapper>
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

export default Notice;