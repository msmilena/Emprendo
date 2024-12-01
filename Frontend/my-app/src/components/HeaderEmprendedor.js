// src/components/Header.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/HeaderEmprendedor.css";
import fotoPerfil from "../assets/fotoPerfilSeñor.jpg";

const HeaderEmprendedor = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserName(userData.nombre);
      setProfileImageUrl(userData.urlPerfil);
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-section') && !event.target.closest('.dropdown-menu')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/login");
  };

  return (
    <header className="header">
      <h3>Panel de administración</h3>
      <div className="profile-section">
        <div className="user-info" onClick={toggleDropdown}>
          <span>{userName}</span>
          <img src={profileImageUrl} alt="User Avatar" className="user-avatar" style={{ objectFit: "cover", borderRadius: "50%" }} />
        </div>
        {isOpen && (
          <div className="dropdown-menu open">
            <ul>
              <li onClick={handleLogoutClick}>Cerrar sesión</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderEmprendedor;
