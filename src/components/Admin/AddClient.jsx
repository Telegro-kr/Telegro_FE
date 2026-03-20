import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Postcode } from '../Postcode/Postcode';
import * as D from './NoticeDetail/NoticeDetailStyle';
import * as A from './AddClientStyle';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

function AddClient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '',
    phone: '',
    id: '', 
    password: '',
    email: '',
    role: '', 
    contactName: '',
    contactPhone: '',
    businessName: '',
    businessNumber: '',
    address: '',
    zipCode: '',
    detailAddress: '',
    industry: '',
    category: '',
    companyDescription: ''
  });

  const handleAddressComplete = ({ fullAddress, zonecode }) => {
    setForm((prevState) => ({
      ...prevState,
      address: fullAddress, 
      zipCode: zonecode,  
    }));
  };

  const roleOptions = {
    MEMBER: 'Member',
    DEALER: 'Dealer',
    BEST: 'Best',
    BUSINESS: 'Business',
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSignupClick = async () => {
    const requiredFields = [
      'companyName', 'phone', 'id', 'password', 'email', 'role',
      'contactName', 'contactPhone', 'businessName', 'businessNumber', 
      'address', 'zipCode', 'detailAddress', 'industry', 'category'
    ];
    const emptyFields = requiredFields.filter(field => !form[field]);

    if (emptyFields.length > 0) {
      alert('모든 필수 항목을 입력해 주세요.');
      return;
    }

    const accessToken = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${accessToken}` };
  
    try {
      const signUpUserInfoDto = {
        userid: form.id,
        username: form.companyName,  
        password: form.password,
        phone: form.phone,
        email: form.email,
        role: form.role, 
        address: form.address,
        addressDetail: form.detailAddress,
        zipCode: form.zipCode,
      };
  
      const company = {  
        managerName: form.contactName,
        managerPhone: form.contactPhone,
        companyName: form.businessName,
        companyNumber: form.businessNumber,
        companyType: form.industry,
        companyItem: form.category,
        companyDescription: form.companyDescription
      };
  
      const DTO = { signUpUserInfoDto, company };
  
      const response = await axios.post(`${API_BASE_URL}/api/companies`, DTO, { headers });
  
      if (response.status === 200) {
        navigate('/admin/clientmanagement');
        alert('사용자 정보가 성공적으로 등록되었습니다.');
      } 
    } catch (error) {
      console.error("Error while signing up:", error);
      if (error.response && error.response.status === 409) {
        alert("이미 사용 중인 상호명 혹은 ID입니다.");
      }
    }
  };

  return (
    <>
      <A.Container>
        <A.Title>회원가입</A.Title>
        <A.FormWrapper>
          <A.SectionTitleWrapper>
            <A.SectionTitle>공급업체 회원가입</A.SectionTitle>
          </A.SectionTitleWrapper>
          <div style={{ padding: '2%' }}>
            <A.Form onSubmit={handleSubmit}>
              <div>
                <A.Label>회원명 *</A.Label>
                <A.Input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <A.Label>전화번호 *</A.Label>
                <A.Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <A.InlineFormWrapper>
                <div>
                  <A.Label>아이디 *</A.Label>
                  <A.Input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <A.Label>비밀번호 *</A.Label>
                  <A.Input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <A.Label>이메일(세금계산서용) *</A.Label>
                  <A.Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <A.Label>회원 유형 *</A.Label>
                  <A.Select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  > 
                    <option value="">회원 유형 선택</option>
                    {Object.entries(roleOptions).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </A.Select>
                </div>
              </A.InlineFormWrapper>

              <A.ContactFormWrapper>
                <div>
                  <A.Label>담당자 이름 *</A.Label>
                  <A.Input
                    style={{ width: '97%' }}
                    name="contactName"
                    value={form.contactName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <A.Label>담당자 전화번호 *</A.Label>
                  <A.Input
                    style={{ width: '97%' }}
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <A.Label>상호명 *</A.Label>
                  <A.Input
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                  />
                </div>
              </A.ContactFormWrapper>

              <div>
                <A.Label>주소 *</A.Label>
                <div style={{ display: 'flex', whiteSpace: 'nowrap', alignItems: 'center' }}>
                  <A.Input
                    name="address"
                    value={form.address}
                    placeholder="주소를 검색해 주세요."
                    readOnly
                  />
                  <A.SearchButton>
                    <Postcode onComplete={handleAddressComplete} />
                  </A.SearchButton>
                </div>
              </div>

              <div>
                <A.Label>사업자 번호 *</A.Label>
                <A.Input
                  name="businessNumber"
                  value={form.businessNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <A.Label>우편번호 *</A.Label>
                <A.Input
                  name="zipCode"
                  value={form.zipCode}
                  readOnly
                />
              </div>
              <div>
                <A.Label>업태 *</A.Label>
                <A.Input
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                />
              </div>
              <div>
                <A.Label>상세주소 *</A.Label>
                <A.Input
                  name="detailAddress"
                  value={form.detailAddress}
                  onChange={handleChange}
                />
              </div>
              <div>
                <A.Label>종목 *</A.Label>
                <A.Input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>
              <div>
                <A.Label>기타 메모 </A.Label>
                <A.Input
                  name="companyDescription"
                  value={form.companyDescription}
                  onChange={handleChange}
                />
              </div>
            </A.Form>
          </div>
        </A.FormWrapper>
      </A.Container>
      <D.BtWrap>
        <D.BtLink as={Link} to="/admin/clientmanagement">
          취소
        </D.BtLink>
        <D.BtLink onClick={handleSignupClick} as={Link} to="">
          등록
        </D.BtLink>
      </D.BtWrap>
    </>
  );
}

export default AddClient;
