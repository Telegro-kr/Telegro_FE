import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Postcode } from '../Postcode/Postcode'; 
import axios from 'axios';
import * as D from './NoticeDetail/NoticeDetailStyle';
import { API_BASE_URL } from '../../constants/api';

const Container = styled.div`
  width: 65%; 
  margin-left: 25%;
  margin-top: 4%;
  @media(max-width: 780px){
    width: 100%; 
    margin-left: 0px;
    margin-top: 10%;
  }
`;


const SearchButton = styled.button`
  border: none;
  background-color: #f2f2f2;
  height: auto;
  border: 1px solid #E0E0E0;
  padding: 1.7% 4%;
  margin-top: 1.1%;
  color: white;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 1%;
`;

const SectionTitleWrapper = styled.div`
  background-color: #f2f2f2; 
  padding: 1%;
  @media(max-width: 780px){
    padding: 3%;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Title = styled.h1`
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 3rem;
  margin-left: 1%;
  @media(max-width: 780px){
    font-size: 1.9rem;
  }
`;

const FormWrapper = styled.div`
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 1.7rem;
  font-weight: bold;
  @media(max-width: 780px){
    font-size: 1.45rem;
    white-space: nowrap;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 1%;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  margin-top: 1%;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4D44B5;
  white-space: nowrap;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #3b3a9d;
  }
`;

const InlineFormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  gap: 20px;
  grid-column: span 2; 
`;

const ContactFormWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.97fr 0.97fr 2fr; 
  gap: 2%;
  max-width: 100%;
  grid-column: span 2; 
`;

function ClientEdit() {
  const { clientId } = useParams(); 
  const navigate = useNavigate();
  const [isDealer, setIsDealer] = useState(false); 
  const [form, setForm] = useState({
    username: '',
    userid: '',
    password: '',
    phone: '',
    email: '',
    address: '',
    addressDetail: '',
    zipCode: '',
    managerName: '',
    managerPhone: '',
    companyName: '',
    companyNumber: '',
    companyType: '',
    companyItem: '',
    companyDescription: '',
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const companyData = response.data.data;
          setForm({
            userid: companyData.userid || '', 
            username: companyData.username || '', 
            phone: companyData.phone || '',
            email: companyData.email || '',
            address: companyData.address || '',
            zipCode: companyData.zipCode || '',
            addressDetail: companyData.addressDetail || '',
            managerName: companyData.managerName || '', 
            managerPhone: companyData.managerPhone || '', 
            companyName: companyData.companyName || '', 
            companyNumber: companyData.companyNumber || '', 
            companyType: companyData.companyType || '', 
            companyItem: companyData.companyItem || '', 
            companyDescription: companyData.companyDescription || '',
          });
          setIsDealer(companyData.role !== 'MEMBER');
        } else {
          alert('회사 정보를 불러오는 데 실패했습니다.');
        }
      } catch {
        alert('회사 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };
    fetchCompanyData();
  }, [clientId]);

  const handleAddressComplete = ({ fullAddress, zonecode }) => {
    setForm((prevState) => ({
      ...prevState,
      address: fullAddress,
      zipCode: zonecode,
    }));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    const payload = {
      user: {
        username: form.username,
        userId: form.userid,
        password: form.password,
        role: form.role,
        phone: form.phone,
        email: form.email,
        address: form.address,
        addressDetail: form.addressDetail,
        zipCode: form.zipCode,
      },
    };
  
    if (payload.user.role !== 'MEMBER') {
      payload.company = {
        managerName: form.managerName,
        managerPhone: form.managerPhone,
        companyName: form.companyName,
        companyNumber: form.companyNumber,
        companyType: form.companyType,
        companyItem: form.companyItem,
        companyDescription: form.companyDescription,
      };
    }
  
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/users/${clientId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        alert('회사 정보가 성공적으로 수정되었습니다.');
        navigate('/admin/clientmanagement');
      }
    } catch {
      alert('회사 정보를 수정하는 데 실패했습니다.');
    }
  };
  const handleDelete = async () => {
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
        navigate('/admin/clientmanagement');
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
      <Container>
        <Title>회원 정보 수정</Title>
        <FormWrapper>
          <SectionTitleWrapper>
            <SectionTitle>회원 정보 수정</SectionTitle>
          </SectionTitleWrapper>
          <div style={{ padding: '2%' }}>
            <Form onSubmit={handleSubmit}>
              <div>
                <Label>회원명 *</Label>
                <Input name="username" value={form.username || ''} onChange={handleChange} required />
              </div>
              <div>
                <Label>전화번호 *</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <InlineFormWrapper style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div>
                  <Label>아이디 *</Label>
                  <Input name="userid" value={form.userid} onChange={handleChange} required />
                </div>
                <div>
                  <Label>이메일(세금계산서용) *</Label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
              </InlineFormWrapper>

              {isDealer && (
                <>
                  <ContactFormWrapper>
                    <div>
                      <Label>담당자 이름 *</Label>
                      <Input
                        style={{ width: '97%' }}
                        name="managerName"
                        value={form.managerName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label>담당자 전화번호 *</Label>
                      <Input
                        style={{ width: '97%' }}
                        name="managerPhone"
                        value={form.managerPhone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label>상호명 *</Label>
                      <Input name="companyName" value={form.companyName} onChange={handleChange} required />
                    </div>
                  </ContactFormWrapper>
                  <div>
                    <Label>주소 *</Label>
                    <div style={{ display: 'flex', whiteSpace: 'nowrap', alignItems: 'center' }}>
                      <Input name="address" value={form.address} placeholder="주소를 검색해 주세요." readOnly />
                      <SearchButton>
                        <Postcode onComplete={handleAddressComplete} />
                      </SearchButton>
                    </div>
                  </div>
                  <div>
                    <Label>사업자 번호 *</Label>
                    <Input name="companyNumber" value={form.companyNumber} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label>우편번호 *</Label>
                    <Input name="zipCode" value={form.zipCode} readOnly />
                  </div>
                  <div>
                    <Label>업태 *</Label>
                    <Input name="companyType" value={form.companyType} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label>상세주소 *</Label>
                    <Input name="addressDetail" value={form.addressDetail} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label>종목 *</Label>
                    <Input name="companyItem" value={form.companyItem} onChange={handleChange} required />
                  </div>
                  <div>
                <Label>기타 메모 </Label>
                <Input
                  name="companyDescription"
                  value={form.companyDescription}
                  onChange={handleChange}
                />
              </div>
                </>
              )}
            </Form>
          </div>
        </FormWrapper>
      </Container>
      <D.BtWrap style={{ width: '70%', marginLeft: '22.5%', marginBottom: '3%' }}>
        <D.BtLink as={Link} to="/admin/clientmanagement">
          취소
        </D.BtLink>
        <D.BtLink as={Link} to="" onClick={handleSubmit}>
          등록
        </D.BtLink>
      </D.BtWrap>
    </>
  );
}

export default ClientEdit;
