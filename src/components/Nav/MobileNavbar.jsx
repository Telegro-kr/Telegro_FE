import { useState, useEffect } from "react";
import {
  FaSearch,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserRole } from "../../store/slices/authSlice";
import Avvvatars from "avvvatars-react";
import * as M from "./MobileNavbarStyle";
import LogoImage from "/src/assets/image/Landing/logo.svg";
import axios from "axios";

export default function MobileNavbar() {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.userRole);
  const [searchValue, setSearchValue] = useState("");
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    id: "",
    phone: "",
    email: "",
    name: "",
    point: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("https://api.telegro.kr/api/users/my", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const userData = response.data.data;
        setUserInfo({
          id: userData.userId,
          phone: userData.phone,
          email: userData.email,
          name: userData.userName,
          point: userData.point,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchProductsByCategory = async (category, page = 0) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`https://api.telegro.kr/products`, {
        headers,
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
    const handleResize = () => {
      if (window.innerWidth > 780) {
        setIsMobileSidebarVisible(true);
      } else {
        setIsMobileSidebarVisible(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
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
      navigate("/search", { state: { filteredProducts: filtered } });
    } else {
      alert("검색 결과가 없습니다.");
    }

    setSearchValue("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUserRole());
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsMobileSidebarVisible(!isMobileSidebarVisible);
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  useEffect(() => {
    checkLoginStatus();
    fetchUserData();
    fetchAllProducts();
  }, []);

  useEffect(() => {
    setIsMobileSidebarVisible(false);
    setIsSubMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <M.TopBar>
        <M.MenuButton onClick={toggleSidebar}>
          {isMobileSidebarVisible ? <FaTimes /> : <FaBars />}
        </M.MenuButton>
        <M.LogoWrapper style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <M.LogoImg src={LogoImage} alt="Telegro Logo" />
          <M.LogoText>Telegro</M.LogoText>
        </M.LogoWrapper>
      </M.TopBar>

      <M.Sidebar show={isMobileSidebarVisible}>
        <M.LogoWrapper style={{ opacity: "0" }}>
          <M.LogoImg src={LogoImage} alt="Telegro Logo" />
          <M.LogoText>Telegro</M.LogoText>
        </M.LogoWrapper>

        <M.SearchBar style={{ marginTop: "2%" }}>
          <FaSearch />
          <form onSubmit={handleSubmit}>
            <M.SearchInput
              type="text"
              placeholder="상품 검색"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
        </M.SearchBar>

        <M.MenuWrapper>
          <M.MenuItem style={{ cursor: "default" }} className="active">
            <FaCog />
            Dashboard
          </M.MenuItem>
          <M.MenuItem onClick={() => navigate("/cart")}>
            <FaCog />
            장바구니
          </M.MenuItem>

          <M.MenuItem onClick={() => navigate("/ordermanager")}>
            <FaCog />
            주문확인
          </M.MenuItem>

          <M.MenuItem onClick={() => navigate("/notice")}>
            <FaCog />
            자료실
          </M.MenuItem>

          <M.MenuItem>
            <FaCog />
            <a href="mailto:Telegro@telegro.com">Contact Us</a>
          </M.MenuItem>

          <M.SubMenuWrapper>
            <M.MenuItem onClick={toggleSubMenu}>
              <FaCog />
              상품 목록
              {isSubMenuOpen ? <FaChevronDown /> : <FaChevronRight />}
            </M.MenuItem>
            <M.SubMenu open={isSubMenuOpen}>
              <M.MenuItem onClick={() => navigate("/headset")}>헤드셋</M.MenuItem>
              <M.MenuItem onClick={() => navigate("/lineCord")}>라인 코드</M.MenuItem>
              <M.MenuItem onClick={() => navigate("/recording")}>녹음기기</M.MenuItem>
              <M.MenuItem onClick={() => navigate("/accessory")}>악세서리</M.MenuItem>
            </M.SubMenu>
          </M.SubMenuWrapper>
        </M.MenuWrapper>

        <M.FooterWrapper>
          {isLoggedIn ? (
            <M.ProfileWrapper onClick={() => navigate("/mypage")} style={{ cursor: "pointer" }}>
              <Avvvatars value={userInfo.id} size={40} />
              <M.ProfileInfo style={{ marginLeft: "10px" }}>
                <div>{userInfo.name}</div>
                <div style={{ fontSize: "0.8rem", color: "#FFD700" }}>{userRole}</div>
              </M.ProfileInfo>
              <M.LogoutButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
              >
                <FaSignOutAlt />
                Log out
              </M.LogoutButton>
            </M.ProfileWrapper>
          ) : (
            <M.ProfileWrapper style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
              <M.ProfileInfo>
                <div>로그인해주세요</div>
              </M.ProfileInfo>
            </M.ProfileWrapper>
          )}
        </M.FooterWrapper>
      </M.Sidebar>
    </>
  );
}
