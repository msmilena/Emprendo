import React, { useState} from "react";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import TextInput from "../components/TextInput";
import AvatarInput from "../components/AvatarInput";
import SubmitButton from "../components/SubmitButton";
import { MdEdit } from "react-icons/md";
import "./CSS/PerfilCliente.css";

const initialUserInfo = {
    name: "Esmeralda",
    surname: "Arango Quispe",
    email: "earangoquispe@gmail.com",
    password: "earango",
    avatar:
      "https://mx.web.img3.acsta.net/c_310_420/pictures/19/11/12/22/54/0812791.jpg",
  };

function PerfilCliente() {

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
    <div className="">
      <Nav />
      <section className="">
        <div className="perfilUsuario-container">
          <h2>Mi Perfil</h2>
          <div className="dashboard-content">
            <TextInput
              label="Nombres"
              name="name"
              value={userDetails.name}
              disabled={true}
              className="form--field marginTop20px"
              onChange={handleChangeDetails}
            />
            
            <TextInput
              label="Apellidos"
              name="surname"
              value={userDetails.surname}
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
              <div
                className="edit--btn"
                onClick={() => setEditEmail(!editEmail)}
              >
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
              <div
                className="edit--btn"
                onClick={() => setEditPassword(!editPassword)}
              >
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
      </section>
      <Footer2 />
    </div>
  );
}

export default PerfilCliente;
