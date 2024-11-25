// src/App.js
import React from "react";
import Sidebar from "../components/SidebarEmprendedor";
import Header from "../components/HeaderEmprendedor";
import FormContainer from "../components/FormContainer";
import './CSS/HomeEmprendedor.css';

function HomeEmprendedor() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <FormContainer />
      </div>
    </div>
  );
}

export default HomeEmprendedor;
