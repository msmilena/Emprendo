import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Nav.css";
import Button from "./Button";

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Carga del usuario desde localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      console.log(userData);
      setIsLoggedIn(true);
      setUserName(userData.nombre);
      setProfileImageUrl(userData.urlPerfil);
      setUserId(userData.uid);
    }

    // Manejo del clic fuera del dropdown
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav--container--profile') && !event.target.closest('.dropdown-menu')) {
        setIsOpen(false);
      }
    };

    // Solo agrega el event listener si el dropdown está abierto
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    // Cleanup del event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]); // Añadido `isOpen` como dependencia

  const handleLoginClick = () => {
    navigate("/login");
  };

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
    <nav className="nav--container">
      <div className="nav--container--content">
        <div className="nav--container--left">
          <div className="nav--container--logo">
            <img alt="logo" src="logo2.svg"></img>
            <strong>Emprendo</strong>
          </div>
          <ul className="nav--container--links">
            <li onClick={() => navigate("/home")}>
              <p>Inicio</p>
            </li>
            <li onClick={() => navigate("/listaEmprendimientos")}>
              <p>Emprendimientos</p>
            </li>
            <li>
              <p>Sobre Nosotros</p>
            </li>
          </ul>
        </div>
        {isLoggedIn ? (
          <div className="user-profile">
            <div className="nav--container--profile" onClick={toggleDropdown}>
              <img
                className="profile--image"
                alt="profile"
                src={profileImageUrl}
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
              <strong>{userName}</strong>
            </div>

            {isOpen && (
              <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                <ul>
                  <li onClick={() => navigate("/perfilCliente")}>Perfil</li>
                  <li onClick={() => navigate(`/favoritos/${userId}`)}>Mis favoritos</li>
                  <li onClick={handleLogoutClick}>Cerrar sesión</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Button variant="orange" onClick={handleLoginClick}>
            Iniciar sesión
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
