import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import * as D from './NoticeDetailStyle'; 
import * as N from '../Notice/NoticeStyle'; 
import { API_BASE_URL } from '../../constants/api';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
const NoticeDetail = () => {
  const { noticeId } = useParams();  
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notices/${noticeId}`);
        if (response.status === 200) {
          setNotice(response.data.data);  
        }
      } catch (error) {
        console.error('Failed to fetch notice details:', error);
      }
    };

    fetchNoticeDetail();
  }, [noticeId]);

  if (!notice) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <N.MainWrapper>
      <D.Section2 style={{ width: '90%', border: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <N.PageTitle>
            <N.TitleText>공지사항</N.TitleText>
          </N.PageTitle>
        </div>

        <D.BoardViewWrap>
          <D.BoardView>
            <D.Title>제목 
              <span style={{ display: 'inline-block', marginLeft: '20px', marginRight: '20px', color: '#aaa', fontSize: '1.6rem' }}>
                |
              </span> 
              {notice.noticeTitle}
            </D.Title>

            <D.Info>
              <D.InfoItem>
                <D.InfoItemText>No</D.InfoItemText>
                <D.InfoItemText>: {notice.id}</D.InfoItemText>
              </D.InfoItem>
              <D.InfoItem>
                <D.InfoItemText>작성일</D.InfoItemText>
                <D.InfoItemText>: {new Date(notice.noticeCreateDate).toLocaleDateString()}</D.InfoItemText>
              </D.InfoItem>
              <D.InfoItem>
                <D.InfoItemText>작성자</D.InfoItemText>
                <D.InfoItemText>: {notice.noticeAuthor}</D.InfoItemText>
              </D.InfoItem>
              <D.InfoItem>
                <D.InfoItemText>조회</D.InfoItemText>
                <D.InfoItemText>: {notice.viewCount}</D.InfoItemText>
              </D.InfoItem>
            </D.Info>
            <D.Cont className="toastui-editor-contents" dangerouslySetInnerHTML={{ __html: notice.noticeContent }} />
            <div style={{ marginTop: '20px' }}>
            <h4>첨부 파일</h4>
            <ul>
            <D.FileList>
              {notice.noticeFiles.map(file => (
                <button key={file.id}>
                  <a href={file.fileUrl} download={file.fileName} target="_blank" rel="noopener noreferrer">
                    {file.fileName}
                  </a>
                </button>
              ))}</D.FileList>
            </ul>
          </div>
          </D.BoardView>
        </D.BoardViewWrap>
      </D.Section2>
    </N.MainWrapper>
      <D.BtWrap>
        <D.BtLink as={Link} to="/notice">
          목록
        </D.BtLink>
      </D.BtWrap>
    </>
  );
}

export default NoticeDetail;