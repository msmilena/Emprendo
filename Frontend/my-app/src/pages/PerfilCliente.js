import React, { useState, useEffect } from "react";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import TextInput from "../components/TextInput";
import AvatarInput from "../components/AvatarInput";
import SubmitButton from "../components/SubmitButton";
import { MdEdit } from "react-icons/md";
import "./CSS/PerfilCliente.css";

function PerfilCliente() {
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
        avatar: ""
    });
    const [editEmail, setEditEmail] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [editName, setEditName] = useState(false);

    useEffect(() => {
        const dataUser = JSON.parse(localStorage.getItem("user"));
        if (dataUser) {
            setUserDetails({
                name: dataUser.nombre,
                email: dataUser.email,
                password: dataUser.password || "",
                avatar: dataUser.urlPerfil
            });
        }
    }, []);

    const handleChangeDetails = (e) => {
      console.log(e);
      setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };
  
    const handleChangeAvatar = (e) => {
      const file = e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setUserDetails({ ...userDetails, avatar: { previewUrl, file } }); // Store both preview URL and file
      }
    };
  
    const handleSubmit = async () => {
        const userId = localStorage.getItem("userId");
        console.log("User ID:", userId);
        if (userId) {
            const formData = new FormData();
            formData.append("idUser", userId); // Use userId from localStorage
            formData.append("name", userDetails.name);
            formData.append("email", userDetails.email);
            formData.append("password", userDetails.password);
            if (userDetails.avatar.file) {
                formData.append("file", userDetails.avatar.file);
            }
            try {
                const response = await fetch(`https://emprendo-usuario-service-26932749356.us-west1.run.app/user/update`, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                console.log(result);
                if (result.success) {
                    // Fetch updated user info
                    const infoResponse = await fetch(`https://emprendo-usuario-service-26932749356.us-west1.run.app/user/info?idUser=${userId}`);
                    const updatedUserInfo = await infoResponse.json();
                    if (updatedUserInfo.success) {
                        console.log("Updated user info:", updatedUserInfo.userData);
                        localStorage.setItem("user", JSON.stringify(updatedUserInfo.userData));
                        console.log("Updated localStorage:", localStorage.getItem("user"));
                        setUserDetails({
                            ...updatedUserInfo.userData,
                            avatar: updatedUserInfo.userData.urlPerfil || userDetails.avatar.previewUrl
                        });  // Set all user information
                        window.location.reload();  // Reload the page
                    }
                    
                }
            } catch (error) {
                console.error("Error updating user information:", error);
            }
        }
    };

  return (
    <div className="">
      <Nav />
      <section className="">
        <div className="perfilUsuario-container">
          <h2>Mi Perfil</h2>
          <div className="dashboard-content">
            <div className="form--field">
              <TextInput
                label="Nombres"
                name="name"
                value={userDetails.name}
                disabled={!editName}
                className="form--field marginTop20px"
                onChange={handleChangeDetails}
              />
              <div
                className="edit--btn"
                onClick={() => setEditName(!editName)}
              >
                <MdEdit />
              </div>
            </div>

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

            {userDetails.password ? (
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
            ) : (
              <div className="form--field">
                <TextInput
                  label="Contraseña"
                  name="password"
                  value="Autenticación por Gmail"
                  disabled={true}
                  className="editable-field marginTop20px"
                />
              </div>
            )}

            <AvatarInput
            className=" marginTop20px"
              label="Imagen de perfil"
              avatar={userDetails.avatar.previewUrl || userDetails.avatar}
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
