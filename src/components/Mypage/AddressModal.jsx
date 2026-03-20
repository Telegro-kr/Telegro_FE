import React, { useState } from 'react';
import axios from 'axios';
import * as M from './ModalStyle';
import CloseIcon from '/src/assets/icon/mypage/close.svg';
import { Postcode } from '../Postcode/Postcode';
import check from '/src/assets/icon/Admin/check.svg';
import checked from '/src/assets/icon/Admin/checked.svg';
import { API_BASE_URL } from '../../constants/api';

export default function AddressModal({ isOpen, toggleModal, onAddAddress }) {
  const [nickname, setNickname] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleAddressSearch = () => {
    setIsSearching(true);
  };

  const handleCheckboxChange = () => {
    setIsDefault(!isDefault);
  };

  const handleAddressComplete = (data) => {
    setFullAddress(data.fullAddress);
    setZipCode(data.zonecode);
    setIsSearching(false);
  };
  
  const setAsDefault = async (addressId) => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/address/${addressId}/set-default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.code === 20000) {
        setIsDefault(true);
      } else {
        alert('기본 배송지 설정에 실패했습니다.');
      }
    } catch (error) {
      alert('기본 배송지 설정 중 오류가 발생했습니다.');
    }
  };
  
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const newAddress = {
      name: nickname,
      address: fullAddress,
      addressDetail: detailAddress,
      zipcode: zipCode,
      isDefault,
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/address`, newAddress, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data.code === 20000) {
        const addedAddress = {
          ...newAddress,
          id: response.data.data.id,
        };
        
        if (isDefault) {
          await setAsDefault(addedAddress.id);
        }
  
        onAddAddress(addedAddress); 
        toggleModal();
      } else {
        alert('주소 추가에 실패했습니다.');
      }
    } catch (error) {
      alert('주소 추가 중 오류가 발생했습니다.');
    }
  };

  return isOpen ? (
    <M.ModalOverlay>
      <M.ModalContent>
        <M.CloseButton onClick={toggleModal}>
          <img src={CloseIcon} alt="Close" />
        </M.CloseButton>
        <M.Title>배송지 추가</M.Title>
        <M.InputField 
          placeholder="별명 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <M.InputField 
          placeholder="주소"
          id="addressText"
          value={fullAddress}
          type="text"
          readOnly
        />
        <div  style={{display: 'flex', flexDirection: 'row', width: '90%', height: '40px', justifyContent: 'space-between'}}>
          <M.InputField 
          style={{width: '73%'}}
          placeholder="우편번호"
          id="zipCodeText"
          type="text"
            value={zipCode}
            readOnly
          />
        <M.SearchButton onClick={handleAddressSearch}>
          <Postcode onComplete={handleAddressComplete}>주소 검색</Postcode>
        </M.SearchButton>
        </div>
        <M.InputField 
          placeholder="상세 주소"
          id="detailAddressText"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
        />
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <M.CheckboxContainer style={{alignItems: 'center'}}>
          <img
            style={{width: '20px', cursor: 'pointer', marginRight: '5px', alignItems: 'center'}}
            src={isDefault ? checked : check} alt="Check"
            onChange={() => setIsDefault(!isDefault)}
            onClick={handleCheckboxChange}
          />
          <M.CheckboxLabel onClick={handleCheckboxChange}>기본 배송지로 설정</M.CheckboxLabel>
        </M.CheckboxContainer>
        </div>
        <div>
          <M.Button onClick={toggleModal}>취소</M.Button>
          <M.Button onClick={handleSubmit}>확인</M.Button>
        </div>
      </M.ModalContent>
    </M.ModalOverlay>
  ) : null;
}
