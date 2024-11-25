// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import RegisterEmprendedor from "./pages/Register-Emprendedor";
import RegisterUsuario from "./pages/RegisterUsuario";
import TipoPerfil from "./pages/TipoPerfil";
import Home from "./pages/Home";
import DetalleEmprendimiento from "./pages/Detalle-Emprendimiento";
import FavoritosUsuarios from "./pages/FavoritosUsuario";
import HomeEmprendedor from "./pages/HomeEmprendedor";
import ProductosEmprendedor from "./pages/ProductosEmprendedor";
import EmprendimientoDatos from "./pages/EmprendimientoDatos";
import PublicidadEmprendedor from "./pages/PublicidadEmprendedor";
import MiPerfilEmprendedor from "./pages/MiPerfilEmprendedor";
import DetallesCuenta from "./pages/DetallesCuenta";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/registerEmprendedor" element={<RegisterEmprendedor />} />
        <Route path="/registerUsuario" element={<RegisterUsuario />} />
        <Route path="/rolSelect" element={<TipoPerfil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/emprendimiento/:id" element={<DetalleEmprendimiento />} />
        <Route path="/favoritos/:id" element={< FavoritosUsuarios />} />
        <Route path="/detalleEmprendimiento/:id" element={< DetalleEmprendimiento />} />

        <Route path="/homeEmprendedor/:id" element={< HomeEmprendedor />} />
        <Route path="/productosEmprendedor/:id" element={< ProductosEmprendedor />} />
        <Route path="/emprendimientoDatos/:id" element={< EmprendimientoDatos />} />
        <Route path="/publicidadEmprendedor/:id" element={< PublicidadEmprendedor />} />
        <Route path="/miPerfilEmprendedor/:id" element={< MiPerfilEmprendedor />} />
        <Route path="/profile" element={<DetallesCuenta />} />

      </Routes>
    </Router>
  );
}

export default App;
