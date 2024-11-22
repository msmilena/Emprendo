// src/components/DashboardOverview.js
import React from "react";
import SummaryCard from "./SummaryCardEmprendedor";
import "./CSS/DashboardOverviewEmprendedor.css";

const DashboardOverviewEmprendedor = () => {
  return (
    <div className="dashboard-overview">
      <SummaryCard title="Valoración" value="4.7" />
      <SummaryCard title="Total de interacciones" value="21" />
      <SummaryCard title="Cantidad de productos" value="12" />
    </div>
  );
};

export default DashboardOverviewEmprendedor;
