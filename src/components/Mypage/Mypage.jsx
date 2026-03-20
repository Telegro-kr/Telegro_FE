import React, { useState, useEffect, useRef } from 'react';
import { FaPhone, FaEnvelope, FaUser, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import * as M from './MypageStyle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import add from '/src/assets/icon/mypage/addaddress.svg';
import AddressModal from './AddressModal'; 
import EditAddressModal from './EditAddressModal';
import profile from '/src/assets/icon/mypage/profile.svg';
import { API_BASE_URL } from '../../constants/api';

const Mypage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [roadAddress, setRoadAddress] = useState(''); 
  const [zipCode, setZipCode] = useState(''); 
  const [detailAddress, setDetailAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false); 
  function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  }
  const [userInfo, setUserInfo] = useState({
    id: '',
    phone: '',
    email: '',
    name: '',
  });
  const [addressList, setAddressList] = useState([]);
  const [currentVisible, setCurrentVisible] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null); 
  const boxRefs = useRef([]);
  const [inView, setInView] = useState([]);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        const userData = response.data.data;
        setUserInfo({
          id: userData.userId,
          phone: userData.phone,
          email: userData.email,
          name: userData.userName,
          point: userData.point
        });
        const sortedAddressList = userData.addressList.sort((a, b) => b.isDefault - a.isDefault);
        setAddressList(sortedAddressList.map(address => ({
          ...address,
          id: address.deliveryAddressId 
        })));
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, []);
  
  const handleDeleteAddress = async (addressId) => {
    const confirmDelete = window.confirm('정말 이 배송지를 삭제하시겠습니까?'); 
    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/users/address/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data.code === 20000) {
        setAddressList((prevAddressList) =>
          prevAddressList.filter((address) => address.id !== addressId)
        );
      } else {
        alert('주소 삭제에 실패했습니다.');
      }
    } catch {
      alert('주소 삭제 중 오류가 발생했습니다.');
    }
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          if (entry.isIntersecting) {
            setInView((prev) => [...prev, index]);
          } else {
            setInView((prev) => prev.filter((i) => i !== index));
          }
        });
      },
      { threshold: 0.1 }
    );

    boxRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => {
      boxRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, [currentVisible]);

  const handleViewMore = () => {
    setCurrentVisible((prevVisible) => prevVisible + 4);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      fetchUserData(); 
    }
    if (!isModalOpen) {
      resetModalFields();
    }
  };

const toggleEditModal = (address) => {
  setSelectedAddress(address); 
  setIsEditModalOpen(!isEditModalOpen);
  if (isEditModalOpen) {
    fetchUserData(); 
  }
};
const forceReload = () => {
  window.location.reload();
};


    const handleAddAddress = (newAddress) => {
      setAddressList((prevAddressList) => [...prevAddressList, newAddress]);
    };
  const handleUpdateAddress = (updatedAddress) => {
    setAddressList((prevAddressList) =>
      prevAddressList.map((address) =>
        address.id === updatedAddress.id ? updatedAddress : address
      )
    );
  };
  
  const resetModalFields = () => {
    setNickname('');
    setRoadAddress('');
    setZipCode('');
    setDetailAddress('');
    setIsDefault(false);
  };

  return (
    <div style={{ backgroundColor: '#eee' }}>
      <M.Container>
        <M.ProfileWrapper>
          <M.TopBackground />
          <M.BottomBackground>
            <M.ProfileImage>
              <img src={profile} style={{width: '150px', marginRight: '70%'}} />
            </M.ProfileImage>
            <M.Name>{userInfo.name}</M.Name>
            <M.UserInfoWrapper>
              <M.UserDetail>
                <M.UserLabel>ID</M.UserLabel>
                <M.UserInfo>
                  <FaUser style={{ marginRight: '10px' }} />
                  {userInfo.id}
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
            </M.UserInfoWrapper>
                <M.UserInfo style={{fontSize: '1.2rem', textAlign: 'left', justifyContent: 'flex-end', marginRight: '3%', color: '#4D44B5', fontWeight: 'bold'}}>
                  보유 적립금: {formatPrice(userInfo.point)}
                </M.UserInfo>
            <div style={{ textAlign: 'left' }}>
              <M.OrderButton onClick={() => navigate('/ordermanager')}>주문 확인</M.OrderButton>
            </div>
          </M.BottomBackground>
        </M.ProfileWrapper>
        <M.AddressListWrapper>
          <M.AddressWrapper>
            <M.AddressTitle>배송지 목록</M.AddressTitle>
            <img src={add} alt="Add Address"  onClick={toggleModal} />
          </M.AddressWrapper>
          {addressList.slice(0, currentVisible).map((address, index) => (
            <M.AddressCard
              key={index}
              ref={(el) => (boxRefs.current[index] = el)}
              data-index={index}
              style={{
                transform: inView.includes(index) ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.3s ease-in-out',
              }}
            >
              <M.AddressBar isDefault={address.isDefault} />
              <M.AddressContent>
                <M.AddressName>{address.name}</M.AddressName>
                <M.AddressDetail>
                  <FaMapMarkerAlt style={{ marginRight: '5px' }} />
                  {address.address} ({address.zipcode})
                </M.AddressDetail>
                <M.AddressDetail>
                  <FaMapMarkerAlt style={{ marginRight: '5px' }} />
                  {address.addressDetail}
                </M.AddressDetail>
              </M.AddressContent>
              <M.AddressActions>
                <FaEdit
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                  onClick={() => toggleEditModal(address)}
                />
                  <FaTrash
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDeleteAddress(address.id)} 
                  />
              </M.AddressActions>
            </M.AddressCard>
          ))}
          {currentVisible < addressList.length && (
            <M.ViewMoreButton onClick={handleViewMore}>View More</M.ViewMoreButton>
          )}
        </M.AddressListWrapper>
      </M.Container>
      <AddressModal isOpen={isModalOpen} toggleModal={toggleModal} onAddAddress={handleAddAddress} />
      {isEditModalOpen && selectedAddress && (
        <EditAddressModal
          isOpen={isEditModalOpen}
          toggleEditModal={toggleEditModal}
          address={selectedAddress} 
          onUpdateAddress={handleUpdateAddress}
        />
      )}
    </div>
  );
};

export default Mypage;
