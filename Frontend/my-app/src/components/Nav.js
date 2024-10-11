import React from "react";
import "./CSS/Nav.css";
import Button from "./Button";

const Nav = () => {
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
        <Button variant="orange">Iniciar sesión</Button>
      </div>
    </nav>
  );
};

export default Nav;
