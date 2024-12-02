// src/App.js
import React, { useEffect } from "react";
import Sidebar from "../components/SidebarEmprendedor";
import Header from "../components/HeaderEmprendedor";
import DashboardOverview from "../components/DashboardOverviewEmprendedor";
import TopProductsList from "../components/TopProductsListEmprendedor";
import Button from "../components/Button";
import './CSS/HomeEmprendedor.css';

function HomeEmprendedor() {
  useEffect(() => {
    const fetchEmprendimientoData = async () => {
      const userId = localStorage.getItem("idusuario"); // O el ID que necesites
      const response = await fetch(`https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/emprendimientoPorEmprendedor?idEmprendedor=${userId}`);
      //const response = await fetch("https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/emprendimientoPorEmprendedor?idEmprendedor=4MIr6M0SyDFdMhb0Nloa");
      const data = await response.json();
  
      if (data.success) {
        localStorage.setItem("emprendimientoId", data.emprendimientoId);  // Guardar el emprendimientoId
      } else {
        console.log("No se pudo obtener el emprendimientoId.");
      }
  
      console.log("Datos de emprendimiento:", data);
    };
  
    fetchEmprendimientoData();
  }, []);
  
  

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
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
