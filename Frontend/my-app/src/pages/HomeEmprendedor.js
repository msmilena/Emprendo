// src/App.js
import React from "react";
import Sidebar from "../components/SidebarEmprendedor";
import Header from "../components/HeaderEmprendedor";
import DashboardOverview from "../components/DashboardOverviewEmprendedor";
import TopProductsList from "../components/TopProductsListEmprendedor";
import Button from "../components/Button";
import './CSS/HomeEmprendedor.css';

function HomeEmprendedor() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          {/* Contenedor con flexbox para título y botón */}
          <h2 className="centered-title">Resumen del emprendimiento</h2>
          <p className="custom-button">
            <Button 
              variant="primary" 
              onClick={() => alert("Botón presionado")}
            >
              Ver dashboard
            </Button>
          </p>
          <DashboardOverview />
          <TopProductsList />
        </div>
      </div>
    </div>
  );
}

export default HomeEmprendedor;
