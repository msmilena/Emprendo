// src/components/Register.js
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "../components/Button";
import FormControl from "../components/FormControl";
import "./CSS/Register-Emprendedor.css"; // Importa el archivo CSS específico
import LeftSide from "../components/leftSide";
import ProgressSteps from "../components/ProgressStep"; // Importa el nuevo componente
import LogoUpload from "../components/LogoUpload";

function RegisterEmprendedor() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [nameStore, setNameStore] = useState("");
  const [logo, setLogo] = useState(null);

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const handleLogoChange = (event) => {
    setLogo(event.target.files[0]);
  };
  const handleRegister = () => {};

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
            controlId="formBasicName"
            type="text"
            placeholder="Ingresa nombre del emprendimiento"
            value={nameStore}
            onChange={(e) => setNameStore(e.target.value)}
            label="Nombre del Emprendimiento"
          />
          <FormControl
            controlId="formBasicEmail"
            type="text"
            placeholder="Ingresa la ubicación del emprendimiento"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Ubicación del Emprendimiento"
          />
          <FormControl
            controlId="formBasicPassword"
            type="number"
            placeholder="Ingresa el Registro Único de Contribuyente"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
