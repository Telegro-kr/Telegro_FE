import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "../Login/LoginStyle";
import { useDispatch } from "react-redux";
import { setUserRole } from "../../store/slices/authSlice";
import axios from "axios";

function GeneralLogin() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://api.telegro.kr/auth/login",
        {
          id: id,
          password: password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { data } = response.data;

        dispatch(setUserRole(data.userRole));

        localStorage.setItem("token", data.accessToken);

        navigate("/");
        alert("로그인에 성공했습니다.");
      } else {
        alert("로그인에 실패했습니다.");
      }
    } catch (error) {
      alert("로그인 실패: " + (error.response?.data?.message || "네트워크 오류"));
    }
  };

  return (
    <L.Wrapper>
      <L.LoginSection>
        <L.Title>Telegro</L.Title>
        <L.InputBox>
          <label htmlFor="idText">아이디</label>
          <input
            id="idText"
            type="text"
            placeholder="아이디를 입력하세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </L.InputBox>
        <L.InputBox>
          <label htmlFor="passwordText">비밀번호</label>
          <input
            id="passwordText"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </L.InputBox>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <L.CheckboxContainer>
            <L.Checkbox type="checkbox" id="checkId" />
            <L.CheckboxLabel htmlFor="checkId">아이디 저장</L.CheckboxLabel>
          </L.CheckboxContainer>
        </div>
        <L.Button2 type="submit" onClick={handleSubmit}>
          로그인
        </L.Button2>
        <L.Button onClick={(e) => navigate("/signup")}>회원가입</L.Button>
      </L.LoginSection>
    </L.Wrapper>
  );
}

export default GeneralLogin;
