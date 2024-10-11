import React from "react";
import "./CSS/Footer.css";

const Footer = () => {
  return (
    <footer className="footer--container">
      <div className="footer--container--content">
        <div className="footer--about--us--container">
          <img src="logo.svg" alt="logo"></img>
          <div className="footer--about--us--info">
            <strong>Emprendo</strong>
            <p>
              Conecta con emprendedores peruanos y descubre productos únicos
              cerca de ti.
            </p>
          </div>
        </div>
        <ul className="footer--menu--items">
          <li>Inicio</li>
          <li>Emprendimientos</li>
          <li>Sobre Nosotros</li>
        </ul>
      </div>
      <img src="circle.svg" className="footer--circle"></img>
    </footer>
  );
};

export default Footer;
