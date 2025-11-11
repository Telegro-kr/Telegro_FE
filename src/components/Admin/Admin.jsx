import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "../Login/LoginStyle";
import { useDispatch } from "react-redux";
import { setUserRole } from "../../store/slices/authSlice";
import axios from "axios";

function Admin() {
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
        navigate("/admin/stat");
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
        <L.Title style={{ fontSize: "1.5rem", color: "#94A3D8" }}>관리자 모드</L.Title>
        <L.Form onSubmit={handleSubmit}>
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
              placeholder="숫자, 문자, 특수문자를 포함한 10자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </L.InputBox>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <L.CheckboxContainer style={{ alignItems: "center" }}>
              <L.Checkbox type="checkbox" id="checkId" />
              <L.CheckboxLabel htmlFor="checkId">아이디 저장</L.CheckboxLabel>
            </L.CheckboxContainer>
            <div>
              <L.Text
                style={{
                  color: "#0F62FE",
                  textDecoration: "underline",
                  textDecorationColor: "#0F62FE",
                }}
              >
                <a href="/GeneralLogin">일반고객으로 로그인</a>
              </L.Text>
            </div>
          </div>
          <L.Button2 type="submit">로그인</L.Button2>
        </L.Form>
      </L.LoginSection>
    </L.Wrapper>
  );
}

export default Admin;
