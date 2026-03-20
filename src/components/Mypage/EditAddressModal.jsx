import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as M from './ModalStyle';
import CloseIcon from '/src/assets/icon/mypage/close.svg';
import { Postcode } from '../Postcode/Postcode';
import check from '/src/assets/icon/Admin/check.svg';
import checked from '/src/assets/icon/Admin/checked.svg';
import { API_BASE_URL } from '../../constants/api';

export default function EditAddressModal({ isOpen, toggleEditModal, address, onUpdateAddress }) {
  const [nickname, setNickname] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (address) {
      setNickname(address.name);
      setFullAddress(address.address);
      setZipCode(address.zipcode);
      setDetailAddress(address.addressDetail);
      setIsDefault(address.isDefault);
    }
  }, [address]);

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
        window.location.reload();
      } else {
        alert('기본 배송지 설정에 실패했습니다.');
      }
    } catch (error) {
      alert('기본 배송지 설정 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const updatedAddress = {
      name: nickname,
      address: fullAddress,
      addressDetail: detailAddress,
      zipcode: zipCode,
      isDefault,
    };

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/users/address/${address.id}`,
        updatedAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.code === 20000) {
        const updatedAddressWithId = {
          ...updatedAddress,
          id: address.id,
        };

        if (isDefault) {
          await setAsDefault(updatedAddressWithId.id); 
        }

        onUpdateAddress(updatedAddressWithId); 
        toggleEditModal();
      } else {
        alert('주소 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('주소 수정 중 오류가 발생했습니다.');
    }
  };

  const handleAddressSearch = () => {
    setIsSearching(true);
  };
  const handleAddressComplete = (data) => {
    setFullAddress(data.fullAddress);
    setZipCode(data.zonecode);
    setIsSearching(false);
  };

  const handleCheckboxChange = () => {
    setIsDefault(!isDefault);
  };

  return isOpen ? (
    <M.ModalOverlay>
      <M.ModalContent>
        <M.CloseButton onClick={toggleEditModal}>
          <img src={CloseIcon} alt="Close" />
        </M.CloseButton>
        <M.Title>배송지 수정</M.Title>
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
        <div style={{display: 'flex', flexDirection: 'row', width: '90%', height: '40px', justifyContent: 'space-between'}}>
          <M.InputField 
            style={{width: '73%'}}
            placeholder="우편번호"
            id="zipCodeText"
            type="text"
            value={zipCode}
            readOnly
          />
          <M.SearchButton onClick={handleAddressSearch}>
            <Postcode onComplete={handleAddressComplete} />
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
             src={isDefault ? checked : check} onChange={() => setIsDefault(!isDefault)} alt="Check" onClick={handleCheckboxChange} />
            <M.CheckboxLabel htmlFor="defaultAddressCheckbox" onClick={handleCheckboxChange}>기본 배송지로 설정</M.CheckboxLabel>
          </M.CheckboxContainer>
        </div>

        <div>
          <M.Button onClick={toggleEditModal}>취소</M.Button>
          <M.Button onClick={handleSubmit}>확인</M.Button>
        </div>
      </M.ModalContent>
    </M.ModalOverlay>
  ) : null;
}
