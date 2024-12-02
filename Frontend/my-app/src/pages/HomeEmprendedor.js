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
      const userId = localStorage.getItem("userId"); // O el ID que necesites
      const response = await fetch(`https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/emprendimientoInfo?idEmprendedor=${userId}`);
      const data = await response.json();
      
      if (data.success && data.emprendimientoData.length > 0) {
        console.log("Datos de emprendimiento:", data.emprendimientoData[0]);
        localStorage.setItem("emprendimientoData", JSON.stringify(data.emprendimientoData[0]));  // Guardar el emprendimientoData
      } else {
        //console.log("No se pudo obtener el emprendimientoData.");
      }
  
      //console.log("Datos de emprendimiento:", data);
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
