import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Nav.css";
import Button from "./Button";

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();  

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      console.log(userData);
      setIsLoggedIn(true);
      setUserName(userData.name);
    }
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
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
            <li>
              <p>Inicio</p>
            </li>
            <li>
              <p>Emprendimientos</p>
            </li>
            <li>
              <p>Sobre Nosotros</p>
            </li>
          </ul>
        </div>
        {isLoggedIn ? (
          <div className="nav--container--profile">
            <img className="profile--image" alt="profile" src="profile-user-account.svg"></img>
            <strong>{userName}</strong>
            <Button variant="orange" onClick={handleLogoutClick}>
              Cerrar sesión
            </Button>
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
