// src/App.js
import React from "react";
import Sidebar from "../components/SidebarEmprendedor";
import Header from "../components/HeaderEmprendedor";
import DashboardOverview from "../components/DashboardOverviewEmprendedor";
import TopProductsList from "../components/TopProductsListEmprendedor";
import './CSS/HomeEmprendedor.css';

function HomeEmprendedor() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <h2>Resumen del emprendimiento</h2>
          <DashboardOverview />
          <TopProductsList />
        </div>
      </div>
    </div>
  );
}

export default HomeEmprendedor;
