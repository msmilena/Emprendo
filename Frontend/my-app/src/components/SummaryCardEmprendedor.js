// src/components/SummaryCard.js
import React from "react";
import "./CSS/SummaryCardEmprendedor.css";

const SummaryCardEmprendedor = ({ title, value }) => {
  return (
    <div className="summary-card">
      <p className="puntuacion_Valores">{value}</p>
      <p>{title}</p>
    </div>
  );
};

export default SummaryCardEmprendedor;
