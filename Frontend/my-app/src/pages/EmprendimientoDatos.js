// src/App.js
import React from "react";
import Sidebar from "../components/SidebarEmprendedor";
import Header from "../components/HeaderEmprendedor";
import DashBoarDatosEmprendimiento from "../components/DashBoarDatosEmprendimiento";
import './CSS/HomeEmprendedor.css';

function HomeEmprendedor() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <h2>Información del emprendimiento</h2>
          <DashBoarDatosEmprendimiento />
        </div>
      </div>
    </div>
  );
}

export default HomeEmprendedor;
