// src/App.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/SidebarEmprendedor";
import Header from "../components/HeaderEmprendedor";
import DashboardOverview from "../components/DashboardOverviewEmprendedor";
import TopProductsList from "../components/TopProductsListEmprendedor";
import Button from "../components/Button";
import './CSS/HomeEmprendedor.css';

function HomeEmprendedor() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [idEmprendimiento, setIdEmprendimiento] = useState("");

  useEffect(() => {
    const fetchEmprendimientoData = async () => {
      const userId = localStorage.getItem("userId"); // Obtener el ID del usuario desde localStorage
      console.log("ID de usuario:", userId);
      // Obtener la información del usuario
      const userResponse = await fetch(`https://emprendo-usuario-service-26932749356.us-west1.run.app//user/info?idUser=${userId}`);
      const userData = await userResponse.json();
      console.log("Datos de usuario:", userData.userData);
      if (userData.success && userData.userData) {
        console.log("Datos de usuario:", userData.userData);
        localStorage.setItem("userData", JSON.stringify(userData.userData));  // Guardar la información del usuario
      } else {
        console.log("No se encontró información del usuario.");
      }

      // Obtener los datos del emprendimiento
      const emprendimientoResponse = await fetch(`https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/emprendimientoInfo?idEmprendedor=${userId}`);
      const emprendimientoData = await emprendimientoResponse.json();

      if (emprendimientoData.success && emprendimientoData.emprendimientoData.length > 0) {
        console.log("Datos de emprendimiento:", emprendimientoData.emprendimientoData[0]);
        localStorage.setItem("emprendimientoData", JSON.stringify(emprendimientoData.emprendimientoData[0]));  // Guardar el emprendimientoData
        setIdEmprendimiento(emprendimientoData.emprendimientoData[0].idEmprendimiento); // Set the idEmprendimiento
      } else {
        console.log("No se pudo obtener el emprendimientoData.");
      }
    };

    fetchEmprendimientoData();
  }, []); // El array vacío asegura que la solicitud se haga solo una vez al cargar el componente

  const openDashboardInNewTab = () => {
    const dashboardUrl = `https://lookerstudio.google.com/embed/u/0/reporting/e52f3640-5699-4aed-b15c-1d3a8df5eb6f/page/xwOXE?params=%7B%22ds26.favidemp%22:%22${idEmprendimiento}%22,%22ds27.validemp%22:%22${idEmprendimiento}%22%7D`;
    window.open(dashboardUrl, '_blank');
  };

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
              onClick={() => setShowDashboard(true)}
            >
              Ver dashboard
            </Button>
            <Button 
              variant="secondary" 
              onClick={openDashboardInNewTab}
            >
              Abrir dashboard en nueva pestaña
            </Button>
          </p>
          {showDashboard && idEmprendimiento && (
            <iframe
              src={`https://lookerstudio.google.com/embed/u/0/reporting/e52f3640-5699-4aed-b15c-1d3a8df5eb6f/page/xwOXE?params=%7B%22ds26.favidemp%22:%22${idEmprendimiento}%22,%22ds27.validemp%22:%22${idEmprendimiento}%22%7D`}
              width="100%"
              height="600px"
              frameBorder="0"
              title="
              Dashboard"
              style={{ border: 0 }}
              allowFullScreen
            ></iframe>
          )}
          <DashboardOverview />
          <TopProductsList />
        </div>
      </div>
    </div>
  );
}

export default HomeEmprendedor;
