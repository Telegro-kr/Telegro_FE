import { useState, useEffect } from "react";
import * as N from "./NavbarStyle";
import { FaSearch } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUserRole } from "../../store/slices/authSlice";
import profile from "/src/assets/icon/mypage/profile.svg";
import axios from "axios";

export default function Navbar() {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const fetchProductsByCategory = async (category, page = 0) => {
    try {
      const response = await axios.get(`https://api.telegro.kr/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { category, page, size: 10 },
      });
      if (response.data.code === 20000) {
        return response.data.data.products;
      } else {
        console.error(`Error fetching products for ${category}:`, response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      const categories = ["HEADSET", "LINE_CORD", "RECORDER", "ACCESSORY"];
      let allProducts = [];

      for (const category of categories) {
        const productsArray = await fetchProductsByCategory(category);
        allProducts = [...allProducts, ...productsArray];
      }

      setProducts(allProducts);
      setIsLoading(false);
    };

    fetchAllProducts();
  }, []);

  const handleLogout = () => {
    dispatch(clearUserRole());
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let filtered = [];
    if (searchValue.trim() !== "") {
      filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (filtered.length > 0) {
      filtered = filtered.sort((a, b) => b.id - a.id);
    }

    if (filtered.length === 0) {
      alert("검색 결과가 없습니다.");
    } else {
      navigate("/search", { state: { filteredProducts: filtered } });
    }

    setSearchValue("");
  };

  return (
    <N.NavWrapper>
      <N.NavContainer>
        <N.Logo href="/">Telegro</N.Logo>
        <N.MainNav>
          <li>
            <a href="/">Home</a>
          </li>
          {!isLoggedIn ? (
            <li>
              <a href="/login">로그인</a>
            </li>
          ) : (
            <li>
              <a
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                로그아웃
              </a>
            </li>
          )}
          <li>
            <a href="/cart">장바구니</a>
          </li>
          <li>
            <a href="mailto:Telegro@telegro.com">Contact Us</a>
          </li>
        </N.MainNav>
        {isLoggedIn && (
          <Link to="/mypage">
            <img src={profile} style={{ width: "40px" }} />
          </Link>
        )}
      </N.NavContainer>

      <N.SecondaryNavContainer>
        <N.SecondaryNav>
          <li>
            <a href="/headset">헤드셋</a>
          </li>
          <li>
            <a href="/lineCord">라인코드</a>
          </li>
          <li>
            <a href="/recording">녹음기기</a>
          </li>
          <li>
            <a href="/accessory">악세서리</a>
          </li>
          <li>
            <a href="/notice">자료실</a>
          </li>
        </N.SecondaryNav>
        <N.SearchWrapper>
          <N.StyledForm onSubmit={handleSubmit}>
            <N.SearchInput
              type="text"
              placeholder="검색"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <N.StyledButton type="submit">
              <FaSearch size={15} />
            </N.StyledButton>
          </N.StyledForm>
        </N.SearchWrapper>
      </N.SecondaryNavContainer>
    </N.NavWrapper>
  );
}
