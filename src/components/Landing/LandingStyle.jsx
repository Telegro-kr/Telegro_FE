import styled from "styled-components";

export const NavWrapper = styled.div`
  top: 0;
  width: 100%;
  background: #000;
  display: flex;
  align-items: center;
  z-index: 1000;
  padding: 1%;
  margin: 0;
  @media (max-width: 780px) {
    padding-bottom: 2%;
  }
`;

export const Logo = styled.a`
  width: 200px;
  font-size: 3rem;
  color: white;
  text-align: center;
  font-weight: bold;
  flex-shrink: 0;
`;

export const Inline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 10%;
  margin-bottom: 5%;
  margin-top: 5%;
  flex-wrap: wrap;
`;

export const Content = styled.div`
  position: relative;
  flex: 1;
  h1 {
    font-size: 3rem;
    font-weight: bold;
  }

  p {
    font-size: 1.6rem;
    margin-top: 3%;
  }
  @media (max-width: 780px) {
    margin-top: 3%;
    h1 {
      font-size: 2.5rem;
      margin-bottom: 4%;
    }
  }
`;
export const Img = styled.img`
  max-height: 100vh;
  margin-right: 1%;
  width: auto;
  object-fit: cover;
  @media (max-width: 780px) {
    max-height: 50vh;
  }
`;

export const ImgWrapper = styled.div`
  width: 350px; /* 너비를 고정 */
  height: 450px; /* 높이를 고정 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LandingWrapper = styled.div`
  background-color: #f2f4f8;
  font-family: Roboto;
`;

export const ButtonWrapper = styled.div`
  margin-top: 10%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 2%;
`;

export const FirstButton = styled.button`
  background-color: #0f62fe;
  color: #fff;
  border-radius: 0.2rem;
  font-size: 1.7rem;
  padding: 2% 3%;
  white-space: nowrap;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  p {
    align-items: center;
    margin: 3%;
  }
  img {
    max-width: 25%;
    margin: 3%;
    align-items: center;
  }
`;

export const SecondButton = styled.button`
  background-color: #ffffff;
  color: #0f62fe;
  border-radius: 0.2rem;
  border: 1px solid #0f62fe;
  white-space: nowrap;
  font-size: 1.7rem;
  padding: 2% 3%;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  p {
    align-items: center;
    margin: 3%;
  }
  img {
    max-width: 25%;
    margin: 3%;
    align-items: center;
  }
`;

export const Intro = styled.div`
  text-align: center;
  align-items: center;
  position: relative;
  justify-content: center;
  margin-bottom: 5%;
`;

export const InlineIntro = styled.div`
  text-align: center;
  align-items: center;
  margin-top: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 3%;
`;

export const Title = styled.div`
  background-color: #0f62fe;
  color: #fff;
  font-size: 2.2rem;
  padding: 0.8% 2%;
  border-radius: 3rem;
  font-weight: bold;
  align-items: center;
  @media (max-width: 780px) {
    font-size: 2rem;
    padding: 1% 1.5%;
  }
`;

export const About = styled.div`
  font-size: 1rem;
  p {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 1%;
  }

  h1 {
    color: #0f62fe;
    font-weight: bold;
    font-size: 2rem;
  }
  @media (max-width: 780px) {
    p {
      font-size: 1.3rem;
    }
    h1 {
      font-size: 1.7rem;
    }
  }
`;

export const List = styled.div`
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 2%;
  color: #444;
  p {
    font-size: 1.9rem;
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: #4871bf;
    }
  }
  @media (max-width: 780px) {
    color: #888;
    margin: 5%;
    font-weight: normal;
    p {
      font-size: 1.4rem;
      &:hover {
        color: #4871bf;
      }
    }
  }
`;

export const FooterWrapper = styled.div`
  background-color: #595f64;
  font-size: 1.2rem;
  padding: 2% 0;
`;

export const FooterInline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  margin-left: 5%;
  @media (max-width: 780px) {
    align-items: center;
  }
`;

export const FooterEnd = styled.div`
  display: flex;
  max-width: 200px;
  min-width: 140px;
  background-color: #f2f4f8;
  border-radius: 2px;
  padding-left: 1%;
  padding-right: 3%;
  align-items: center;
  white-space: nowrap;
  img {
    max-width: 20%;
    align-items: center;
  }
  p {
    font-size: 1.3rem;
    white-space: nowrap;
    color: #697077;
    align-items: center;
    margin-bottom: 3%;
    @media (max-width: 800px) {
      font-size: 1rem;
      padding-right: 5%;
    }
  }
  @media (max-width: 780px) {
    white-space: normal;
    height: 35px;
  }
`;

export const Footerline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
  margin-left: 5%;
`;

export const FooterTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 5%;

  img {
    width: 50px;
  }
  p {
    font-size: 1.44vw;
    color: #c1c7cd;
    font-weight: bold;
    @media (max-width: 800px) {
      font-size: 1.64rem;
    }
  }
  @media (max-width: 780px) {
    img {
      width: 40px;
    }
  }
`;

export const FooterBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  white-space: nowrap;
  width: 40%;
  gap: 2%;
  @media (max-width: 780px) {
  }
`;

export const Contact = styled.button`
  background-color: #0f62fe;
  color: #fff;
  border: 1px solid #0f62fe;
  border-radius: 0.2rem;
  font-size: 1.5rem;
  padding: 2% 3%;
  border-radius: 2px;
  align-items: center;
  display: flex;
  font-weight: semi-bold;
  flex-direction: row;
  justify-content: space-around;
  p {
    align-items: center;
    margin: 1%;
  }
  @media (max-width: 780px) {
    padding: 0px 3%;
    font-size: 1.1rem;
  }
`;
export const TextWrapper = styled.div`
  flex-direction: column;
  text-align: left;
  margin-top: 3%;
  margin-bottom: 3%;
  color: #fff;
  margin-left: 5%;
  h1 {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 1.3%;
  }
  p {
    font-size: 1.2rem;
    margin-bottom: 0.7%;
  }
  @media (max-width: 780px) {
    h1 {
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 3%;
    }
    p {
      font-size: 0.9rem;
      margin-bottom: 1.8%;
    }
  }
`;

export const Copyright = styled.div`
  flex-direction: column;
  text-align: left;
  margin-top: 2%;
  margin-bottom: 2%;
  color: #fff;
  font-size: 1.3rem;
  @media (max-width: 780px) {
    font-size: 1.1rem;
  }
  a {
    &:hover {
      color: #94a3d8;
      font-weight: bold;
    }
  }
`;
