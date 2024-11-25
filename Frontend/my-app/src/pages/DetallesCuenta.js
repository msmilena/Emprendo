import React, { useState } from "react";
import SidebarEmprendedor from "../components/SidebarEmprendedor";
import { MdEdit } from "react-icons/md";
import "./CSS/DetallesCuenta.css";
import Button from "../components/Button";
import HeaderEmprendedor from "../components/HeaderEmprendedor";

const initialUserInfo = {
  name: "Esmeralda",
  surname: "Arango Quispe",
  email: "earangoquispe@gmail.com",
  password: "earango",
  avatar:
    "https://mx.web.img3.acsta.net/c_310_420/pictures/19/11/12/22/54/0812791.jpg",
};

const DetallesCuenta = () => {
  const [userDetails, setUserDetails] = useState(initialUserInfo);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const handleChangeDetails = (e) => {
    console.log(e);
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
    //hacer lo que se desee con la info
    console.log(userDetails);
  };

  return (
    <div className="account--details--page">
      <SidebarEmprendedor />

      <div className="account--details--form--container">
        <HeaderEmprendedor />
        <strong className="account--details--page--title">Mi perfil</strong>
        <div className="form--account--details">
          <div className="form--field">
            <label className="form--label">Nombres</label>
            <input
              disabled
              type="text"
              name="name"
              value={userDetails.name}
              className="form--input"
              onChange={(e) => handleChangeDetails(e)}
            ></input>
          </div>
          <div className="form--field">
            <label className="form--label">Apellidos</label>
            <input
              disabled
              type="text"
              name="surname"
              value={userDetails.surname}
              className="form--input"
              onChange={(e) => handleChangeDetails(e)}
            ></input>
          </div>
          <div className="form--field">
            <label className="form--label">Correo</label>
            <input
              disabled={!editEmail}
              name="email"
              value={userDetails.email}
              type="text"
              className="form--input"
              onChange={(e) => handleChangeDetails(e)}
            ></input>
            <div className="edit--btn" onClick={() => setEditEmail(!editEmail)}>
              <MdEdit />
            </div>
          </div>
          <div className="form--field">
            <label className="form--label">Contraseña</label>
            <input
              name="password"
              disabled={!editPassword}
              value={userDetails.password}
              type={editPassword ? "text" : "password"}
              onChange={(e) => handleChangeDetails(e)}
              className="form--input"
            ></input>
            <div
              className="edit--btn"
              onClick={() => setEditPassword(!editPassword)}
            >
              <MdEdit />
            </div>
          </div>
          <div className="avatar--form">
            <p>Imagen de perfil</p>
            <div className="avatar--field">
              <img
                alt="avatar"
                className="avatar--image"
                src={userDetails.avatar}
              ></img>
            </div>
            <div className="avatar--input">
              <label htmlFor="avatar">Cambiar imagen de perfil</label>
              <input
                id="avatar"
                type="file"
                name="avatar"
                accept="image/*"
                onChange={(e) => handleChangeAvatar(e)}
              />
            </div>
          </div>
          <Button children="Guardar cambios" onClick={() => handleSubmit()} />
        </div>
      </div>
    </div>
  );
};

export default DetallesCuenta;