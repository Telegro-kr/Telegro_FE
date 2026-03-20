import React, { useState, useEffect } from 'react';
import * as B from '../NotificationBar/NotificationStyle';
import axios from 'axios';
import Img from '/src/assets/image/Landing/logo.svg'; 
import { API_BASE_URL } from '../../constants/api';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

const NoticePopup = () => {
  const [visible, setVisible] = useState(true);
  const [notice, setNotice] = useState(null);  
  const [error, setError] = useState('');

  const fetchPopupNotice = async () => {
    try {
      const popupResponse = await axios.get(`${API_BASE_URL}/notices/popup`);
      if (popupResponse.status === 200) {
        const noticeId = popupResponse.data.data.id;

        const noticeResponse = await axios.get(`${API_BASE_URL}/notices/${noticeId}`);
        if (noticeResponse.status === 200) {
          setNotice(noticeResponse.data.data);
        }
      }
    } catch (error) {
      setError('공지사항 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchPopupNotice();

    const hidePopupDate = localStorage.getItem('hidePopupDate');
    const todayDate = new Date().toISOString().split('T')[0];
    if (hidePopupDate === todayDate) {
      setVisible(false);
    }
  }, []);

  const handleClose = (forToday) => {
    if (forToday) {
      const todayDate = new Date().toISOString().split('T')[0];
      localStorage.setItem('hidePopupDate', todayDate);
    }
    setVisible(false);
  };

  if (!visible || !notice) {
    return null;
  }

  return (
      <>
        <B.Overlay onClick={() => handleClose(false)} />
        <B.PopupWrapper>
          <B.Header>
            <B.HeaderTitle>
              <B.Logo src={Img} alt="Telegro Logo" />
              Telegro
            </B.HeaderTitle>
            <B.PoPupCloseButton onClick={() => handleClose(false)} />
          </B.Header>
          <B.Content>
            <h2>{notice.noticeTitle}</h2>
            <B.HorizontalRule />
            <p className="toastui-editor-contents" dangerouslySetInnerHTML={{ __html: notice.noticeContent }} />
          </B.Content>
          <B.Footer>
            <B.ConfirmButton onClick={() => handleClose(true)}>오늘 하루 보지 않기</B.ConfirmButton>
            <B.ConfirmButton onClick={() => handleClose(false)}>닫기</B.ConfirmButton>
          </B.Footer>
        </B.PopupWrapper>
      </>
  );
};

export default NoticePopup;