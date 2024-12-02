import React, { useState, useEffect } from "react";
import SidebarEmprendedor from "../components/SidebarEmprendedor";
import { MdEdit } from "react-icons/md";
import "./CSS/DetallesCuenta.css";
import SubmitButton from "../components/SubmitButton";
import HeaderEmprendedor from "../components/HeaderEmprendedor";
import TextInput from "../components/TextInput";
import AvatarInput from "../components/AvatarInput";

const DetallesCuenta = () => {
  // Obtener los datos del usuario desde localStorage
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  // Establecer el estado inicial con los datos obtenidos
  const [userDetails, setUserDetails] = useState({
    name: storedUserData?.nombre || "",  // Si no hay datos, se usa una cadena vacía por defecto
    email: storedUserData?.email || "",
    password: storedUserData?.password || "",
    avatar: storedUserData?.urlPerfil || "",
  });

  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const handleChangeDetails = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserDetails({ ...userDetails, avatar: imageUrl });
    }
  };

  const handleSubmit = () => {
    // Realizar lo que desees con la información (como enviar los datos a un servidor)
    console.log(userDetails);
  };

  return (
    <div className="account--details--page">
      <SidebarEmprendedor />
      <div className="main-content">
        <HeaderEmprendedor />
        <div className="dashboard-content">
          <h2 className="centered-title">Mi Perfil</h2>
          <div className="dashboard-content">
            <TextInput
              label="Nombres"
              name="name"
              value={userDetails.name}
              disabled={true}
              className="form--field marginTop20px"
              onChange={handleChangeDetails}
            />

            <div className="form--field">
              <TextInput
                label="Correo"
                name="email"
                value={userDetails.email}
                disabled={!editEmail}
                onChange={handleChangeDetails}
                className="editable-field marginTop20px"
              />
              <div className="edit--btn" onClick={() => setEditEmail(!editEmail)}>
                <MdEdit />
              </div>
            </div>

            <div className="form--field">
              <TextInput
                label="Contraseña"
                name="password"
                value={userDetails.password}
                disabled={!editPassword}
                type={editPassword ? "text" : "password"}
                onChange={handleChangeDetails}
                className="editable-field marginTop20px"
              />
              <div className="edit--btn" onClick={() => setEditPassword(!editPassword)}>
                <MdEdit />
              </div>
            </div>

            <AvatarInput
              className=" marginTop20px"
              label="Imagen de perfil"
              avatar={userDetails.avatar}
              onChange={handleChangeAvatar}
            />

            <SubmitButton className="guaAgreBtn" nameText="Guardar cambios" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesCuenta;
