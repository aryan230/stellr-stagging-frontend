import "./css/main.css";
import Editor from "./Pages/Editor";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Project from "./Pages/Project";
import { useEffect, useState } from "react";
import ProjectComp from "./Components/Project/ProjectComp";
import ProfilePage from "./Pages/ProfilePage";
import AccountSetup from "./Pages/AccountSetup";
import OrganizationSetup from "./Pages/OrganizationSetup";
import Footer from "./Pages/Footer";
import Banner from "./Components/Banner";
import { useDispatch } from "react-redux";
import { logout } from "./redux/actions/userActions";
import ENV from "./Data/data.json";
import MainRed from "./Redirections/MainRed";
import Recovery from "./Pages/Recovery";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem("stellrLogout2")) {
      dispatch(logout());
      localStorage.setItem("stellrLogout2", true);
    }
  }, []);

  return window.screen.width === 1 && ENV[1] != "staging" ? (
    <div className="App">
      <div className="mobile-responsive">
        <img src="../assets/stellr-logo.png" alt="" className="logo-login" />
        <p>
          Stellr is currently only available for desktops, laptops, and tablets.
        </p>
      </div>
    </div>
  ) : (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/*" element={<Editor />} />
          <Route path="/admin/users" element={<Editor />} />
          <Route path="/account/setup" element={<AccountSetup />} />
          <Route path="/organization/setup" element={<OrganizationSetup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Register />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recovery" element={<Recovery />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
