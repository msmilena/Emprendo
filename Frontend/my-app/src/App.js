// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import RegisterEmprendedor from "./pages/Register-Emprendedor";
import RegisterUsuario from "./pages/RegisterUsuario";
import TipoPerfil from "./pages/TipoPerfil";
import Home from "./pages/Home";
import DetalleEmprendimiento from "./pages/Detalle-Emprendimiento";
import FavoritosUsuarios from "./pages/FavoritosUsuario.js";
import HomeEmprendedor from "./pages/HomeEmprendedor.js"
import Emprendimiento from "./pages/EmprendimientoDatos.js"
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
        <Route path="/homeEmprendedor" element={< HomeEmprendedor />} />
        <Route path="/detalleEmpredimiento/:id" element={< Emprendimiento />} />
      </Routes>
    </Router>
  );
}

export default App;
