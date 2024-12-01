// src/components/Sidebar.js
import React, { useEffect, useState } from "react";
import "./CSS/SiderbarEmprendedor.css";
import ecoVidaLogo from '../assets/ecoVidaLogo.png';
import { useNavigate } from "react-router-dom";

const SidebarEmprendedor = () => {
  const [emprendimientoData, setEmprendimientoData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("emprendimientoData"));
    setEmprendimientoData(data);
  }, []);

  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="logo-section">
        {emprendimientoData && (
          <>
            <img src={emprendimientoData.image_url} alt="Emprendimiento Logo" className="logo" style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "50%" }} />
            <h2 className="nombreEmprendimiento" style={{ wordWrap: "break-word", textAlign: "center" }}>{emprendimientoData.nombreComercial}</h2>
          </>
        )}
      </div>
      <nav className="nav-menu">
        <ul>
          <li onClick={() => handleNavigation("/homeEmprendedor/APEQO6fohuDykka1Uqjn")}>Inicio</li>
          <li onClick={() => handleNavigation("/productosEmprendedor/APEQO6fohuDykka1Uqjn")}>Productos</li>
          <li onClick={() => handleNavigation("/emprendimientoDatos/APEQO6fohuDykka1Uqjn")}>Emprendimiento</li>
          <li onClick={() => handleNavigation("/publicidadEmprendedor/APEQO6fohuDykka1Uqjn")}>Publicidad</li>
          <li onClick={() => handleNavigation("/miPerfilEmprendedor/APEQO6fohuDykka1Uqjn")}>Mi perfil</li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarEmprendedor;