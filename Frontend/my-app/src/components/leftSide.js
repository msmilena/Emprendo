// src/components/LeftSide.js
import React from "react";
import "./CSS/leftSide.css"; // Importa el archivo CSS específico

function LeftSide() {
  return (
    <div className="ladoEmprendo">
      <div className="img_icono"></div>
      <div className="texto_ladoEmprendo">
        <div className="logo">Emprendo</div>
        <p className="eslogan">
          Conecta con emprendedores peruanos y descubre productos únicos cerca
          de ti.
        </p>
      </div>
    </div>
  );
}

export default LeftSide;
