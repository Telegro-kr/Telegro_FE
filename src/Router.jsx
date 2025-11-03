import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import GeneralLoginPage from "./pages/GeneralLogin";
import LandingPage from "./pages/Landing";
import SignupPage from "./pages/Signup";
import AdminPage from "./pages/Admin";
import User from "./User";
import Admin from "./Admin";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/generallogin" element={<GeneralLoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/*" element={<User />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
