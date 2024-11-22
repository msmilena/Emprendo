// src/components/Header.js
import React from "react";
import "./CSS/HeaderEmprendedor.css";
import fotoPerfil from "../assets/fotoPerfilSeñor.jpg"

const HeaderEmprendedor = () => {
  return (
    <header className="header">
      <h3>Panel de administración</h3>
      <div className="profile-section">
        <div className="user-info">
          <span>Raúl Sánchez</span>
          <img src={fotoPerfil} alt="User Avatar" className="user-avatar" style={{objectFit: "cover", borderRadius: "50%" }}/>
        </div>
      </div>
    </header>
  );
};

export default HeaderEmprendedor;
