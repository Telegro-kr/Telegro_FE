import React, { useState, useEffect } from 'react';
import * as L from './LandingStyle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Img from '/src/assets/image/Landing/image1.png';
import Img2 from '/src/assets/image/Landing/image2.png';
import Img3 from '/src/assets/image/Landing/image3.png';
import Img4 from '/src/assets/image/Landing/image4.png';
import Next from '/src/assets/image/Landing/next.svg';
import NextBlue from '/src/assets/image/Landing/nextBlue.svg';
import Logo from '/src/assets/image/Landing/logo.svg';
import Mail from '/src/assets/image/Landing/mail.svg';
import { API_BASE_URL } from '../../constants/api';

export default function Landing() {
  const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(Img);
  
    useEffect(() => {
      const images = [Img, Img2, Img3, Img4];
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length; 
        setCurrentImage(images[currentIndex]);
      }, 3000); 
  
      axios.post(`${API_BASE_URL}/hits`, {}, {
        withCredentials: true
      })
      .catch(error => {
        console.error('Error posting hits:', error);
      });
  
      return () => {
        clearInterval(intervalId); 
      };
    }, []);
  
  return (
    <>
    <L.LandingWrapper>
    <L.NavWrapper>
      <L.Logo href="">Telegro</L.Logo>
    </L.NavWrapper>
    <L.Inline>
    <L.Content>
      <h1>프리미엄 헤드셋과<br />
      녹음 장비 브랜드</h1>
      <p>기술과 품질로 고객 여러분의 만족을 최우선 합니다.</p>
      <L.ButtonWrapper>
      <L.FirstButton onClick={() => navigate('/GeneralLogin')}><p>구매고객 </p><img src={Next} /></L.FirstButton>
      <L.SecondButton onClick={() => navigate('/login')}><p>공급업체 </p><img src={NextBlue} /></L.SecondButton>
      </L.ButtonWrapper>
      </L.Content>
      <L.ImgWrapper>
          <L.Img src={currentImage} />
        </L.ImgWrapper>
      </L.Inline>
      <L.Intro>
        <L.InlineIntro>
          <L.Title><p>Telegro</p></L.Title>
          <L.About>
            <p>기술개발 전문제조 공급 유통</p>
            <h1>헤드셋 녹취 장비 전문</h1>
          </L.About>
        </L.InlineIntro>
      </L.Intro>
      <L.List>
        <p onClick={() => navigate('/headset')}>헤드셋</p>
        <p onClick={() => navigate('/lineCord')}>라인코드</p>
        <p onClick={() => navigate('/recording')}>녹음기기</p>
        <p onClick={() => navigate('/accessory')}>악세서리</p>
        <p onClick={() => navigate('/notice')}>자료실</p>
      </L.List>
      <L.FooterWrapper>
        <L.FooterInline>
          <L.FooterTitle>
            <img src={Logo} />
            <p>Telegro</p>
          </L.FooterTitle>
          <L.FooterBox>
          <L.FooterEnd>
            <img src={Mail} />
            <p>ykjroom@naver.com</p>
          </L.FooterEnd>
          <L.Contact><a href="mailto:ykjroom@naver.com">Contact Us</a></L.Contact>
          </L.FooterBox>
        </L.FooterInline>
        <hr style={{margin: '2%', width: '90%', marginLeft: '5%', color: '#C1C7CD'}}/>
        <L.TextWrapper>
          <h1>텔레그로 (서연전자)</h1>
          <p>주소: 서울특별시 광진구 광나루로56길 85 테크노마트 21 8층 A30, 31호</p>
          <p>고객센터: 070-4111-5733</p>
          <p>A/S 물류배송지: 경기도 남양주시 오남읍 양지로281번길 101로젠택배 평내영업소(서연전자)</p>
          <p>대표자명 : 연경진</p>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '4%'}}>
            <p>사업자 등록번호: 215-18-12286</p>
            <p>통신판매업: 제 2024-서울광진-1511호</p>
          </div>
        </L.TextWrapper>
        <hr style={{margin: '2%', width: '90%', marginLeft: '5%', color: '#C1C7CD'}}/>
        <div style={{margin: '2% auto',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', maxWidth: '90%'}}>
        <L.Copyright>Telegro @ 2024. All rights reserved.</L.Copyright>
        <L.Copyright><a href="/privacy">개인정보처리방침</a> | <a href="/privacy">이용약관</a></L.Copyright>
        </div>
      </L.FooterWrapper>
    </L.LandingWrapper>

    </>
  );
}
