// src/components/EmprendimientosList.js
import React from "react";
import EmprendimientoItem from "./EmprendimientoItem";
import "./CSS/EmprendimientosListDetalle.css"; // Asegúrate de crear este archivo para los estilos

function EmprendimientosListDetalle({ data }) {
  return (
    <div className="emprendimientos-list">
      {data.map((item) => (
        <EmprendimientoItem key={item.id} data={item} />
      ))}
    </div>
  );
}

export default EmprendimientosListDetalle;
