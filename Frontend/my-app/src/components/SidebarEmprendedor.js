// src/components/Sidebar.js
import React from "react";
import "./CSS/SiderbarEmprendedor.css";
import ecoVidaLogo from '../assets/ecoVidaLogo.png';


const SidebarEmprendedor = () => {
  return (
    <div className="sidebar">
      <div className="logo-section">
        <img src={ecoVidaLogo} alt="EcoVida Market Logo" className="logo"  style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "50%" }}/>
        <h2>EcoVida Market</h2>
      </div>
      <nav className="nav-menu">
        <ul>
          <li>Inicio</li>
          <li>Productos</li>
          <li>Emprendimiento</li>
          <li>Mi perfil</li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarEmprendedor;
