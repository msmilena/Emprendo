// src/components/Register.js
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "../components/Button";
import FormControl from "../components/FormControl";
import "./CSS/Register-Emprendedor.css"; // Importa el archivo CSS específico
import LeftSide from "../components/leftSide";
import ProgressSteps from "../components/ProgressStep"; // Importa el nuevo componente
import LogoUpload from "../components/LogoUpload";
import { useNavigate } from "react-router-dom";

function RegisterEmprendedor() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [nameStore, setNameStore] = useState("");
  const [ruc, setRuc] = useState("");
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();  

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const handleLogoChange = (event) => {
    setLogo(event.target.files[0]);
  };
  const handleRegister = async () => {
    const formData = new FormData();
    formData.append("nombre", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("tipo", 'emprendedor'); // Replace with actual user type
    formData.append("tipoAuth", 0); // Replace with actual auth type
    formData.append("nombreComercial", nameStore);
    formData.append("ruc", ruc);
    formData.append("localizacion_latitud", 0); // Replace with actual latitaude
    formData.append("localizacion_longitud", 0); // Replace with actual longitude
    if (logo) {
      formData.append("file", logo);
    }
    console.log("formData", formData);
    try {
      const response = await fetch("http://127.0.0.1:8080/auth/register_with_emprendimiento", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        alert("Usuario y emprendimiento registrados exitosamente");
        navigate("/");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al registrar usuario y emprendimiento");
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <h1>Registro</h1>
          <p className="textIngreso">
            Completa tus datos personales y del emprendimiento
          </p>
          <FormControl
            controlId="formBasicName"
            type="text"
            placeholder="Ingresa nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Nombre Completo"
          />
          <FormControl
            controlId="formBasicEmail"
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Correo electrónico"
          />
          <FormControl
            controlId="formBasicPassword"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Contraseña"
          />
          <Button variant="orange" onClick={handleNextStep}>
            Siguiente
          </Button>
        </>
      );
    } else if (currentStep === 2) {
      return (
        <>
          <h1>Registro</h1>
          <p className="textIngreso">
            Completa tus datos personales y del emprendimiento
          </p>
          <FormControl
            controlId="formBasicNameStore"
            type="text"
            placeholder="Ingresa nombre del emprendimiento"
            value={nameStore}
            onChange={(e) => setNameStore(e.target.value)}
            label="Nombre del Emprendimiento"
          />
          <FormControl
            controlId="formBasicRUC"
            type="number"
            placeholder="Ingresa el Registro Único de Contribuyente"
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
            label="RUC"
          />
          <Button variant="orange" onClick={handleNextStep}>
            Siguiente
          </Button>
        </>
      );
    } else if (currentStep === 3) {
      return (
        <>
          <h1>Registro</h1>
          <p className="textIngreso">
            Completa tus datos personales y del emprendimiento
          </p>
          <LogoUpload onLogoChange={handleLogoChange} />
          <Button variant="orange" onClick={handleRegister}>
            Registrar
          </Button>
        </>
      );
    }
  };

  return (
    <Container fluid className="">
      <Row>
        <Col xs={6} className="left-side">
          <LeftSide />
        </Col>
        <Col xs={6} className="right-side">
          <ProgressSteps currentStep={currentStep} />
          <form>{renderStepContent()}</form>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterEmprendedor;
