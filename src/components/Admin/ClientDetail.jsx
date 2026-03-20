import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaUser, FaBuilding, FaBriefcase, FaUserTie, FaBox, FaMapMarkerAlt } from 'react-icons/fa';
import * as M from '../Mypage/MypageStyle';
import Avvvatars from 'avvvatars-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

const ClientDetail = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/${clientId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.code === 20000) {
          setUserInfo(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch user data');
        }
      } catch (error) {
        setError(`Failed to load user details: ${error.message}`);
      }
    };

    fetchUserDetails();
  }, [clientId]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const isMember = userInfo.role !== 'MEMBER'; 

  return (
    <div style={{ backgroundColor: '#eee' }}>
      <M.AdminContainer>
        <M.AdminProfileWrapper>
          <M.TopBackground />
          <M.BottomBackground>
            <M.ProfileImage>
              <Avvvatars value={userInfo.username} style="Shapes" size="150" round={true} />
            </M.ProfileImage>
            <M.Name>{userInfo.username}</M.Name>
            <M.ClientInfoWrapper>
              <M.UserDetail>
                <M.UserLabel>ID</M.UserLabel>
                <M.UserInfo>
                  <FaUser style={{ marginRight: '10px' }} />
                  {userInfo.userid}
                </M.UserInfo>
              </M.UserDetail>
              <M.UserDetail>
                <M.UserLabel>Phone</M.UserLabel>
                <M.UserInfo>
                  <FaPhone style={{ marginRight: '10px' }} />
                  {userInfo.phone}
                </M.UserInfo>
              </M.UserDetail>
              <M.UserDetail>
                <M.UserLabel>Email</M.UserLabel>
                <M.UserInfo>
                  <FaEnvelope style={{ marginRight: '10px' }} />
                  {userInfo.email}
                </M.UserInfo>
              </M.UserDetail>
            </M.ClientInfoWrapper>
            <M.UserInfo style={{ fontSize: '1.2rem', textAlign: 'left', justifyContent: 'flex-end', marginRight: '3%', color: '#4D44B5', fontWeight: 'bold' }}>
              보유 적립금: {formatPrice(userInfo.point)}
            </M.UserInfo>
            <div style={{ textAlign: 'left' }}>
              <M.OrderButton onClick={() => navigate('/ordermanager')}>주문 확인</M.OrderButton>
            </div>
          </M.BottomBackground>
        </M.AdminProfileWrapper>

        <div style={{ height: '20px' }} />

        {isMember && (
          <M.AdminProfileWrapper>
            <M.BottomBackground>
              <M.ClientInfoWrapper>
                <M.UserDetail>
                  <M.UserLabel>회원명(대표자)</M.UserLabel>
                  <M.UserInfo>
                    <FaUser style={{ marginRight: '10px' }} />
                    {userInfo.managerName}
                  </M.UserInfo>
                </M.UserDetail>
                <M.UserDetail>
                  <M.UserLabel>사업자 등록번호</M.UserLabel>
                  <M.UserInfo>
                    <FaBuilding style={{ marginRight: '10px' }} />
                    {userInfo.companyNumber}
                  </M.UserInfo>
                </M.UserDetail>
                <M.UserDetail>
                  <M.UserLabel>영업소재지(주소)</M.UserLabel>
                  <M.UserInfo>
                    <FaMapMarkerAlt style={{ marginRight: '10px' }} />
                    {userInfo.address}
                  </M.UserInfo>
                  <M.UserInfo style={{ marginLeft: '9%' }}>
                    ({userInfo.addressDetail}, {userInfo.zipCode})
                  </M.UserInfo>
                </M.UserDetail>
              </M.ClientInfoWrapper>
              <M.ClientInfoWrapper>
                <M.UserDetail>
                  <M.UserLabel>Company Type</M.UserLabel>
                  <M.UserInfo>
                    <FaBriefcase style={{ marginRight: '10px' }} />
                    {userInfo.companyType}
                  </M.UserInfo>
                </M.UserDetail>
                <M.UserDetail>
                  <M.UserLabel>Company Item</M.UserLabel>
                  <M.UserInfo>
                    <FaBox style={{ marginRight: '10px' }} />
                    {userInfo.companyItem}
                  </M.UserInfo>
                </M.UserDetail>
                <M.UserDetail>
                  <M.UserLabel>Role</M.UserLabel>
                  <M.UserInfo>
                    <FaUserTie style={{ marginRight: '10px' }} />
                    {userInfo.role}
                  </M.UserInfo>
                </M.UserDetail>
                <M.UserDetail>
                  <M.UserLabel>기타사항</M.UserLabel>
                  <M.UserInfo style={{ fontSize: '1.5rem' }}>
                    *{userInfo.companyDescription || '기타사항이 없습니다.'}
                  </M.UserInfo>
                </M.UserDetail>
              </M.ClientInfoWrapper>
            </M.BottomBackground>
          </M.AdminProfileWrapper>
        )}
      </M.AdminContainer>
    </div>
  );
};

export default ClientDetail;
