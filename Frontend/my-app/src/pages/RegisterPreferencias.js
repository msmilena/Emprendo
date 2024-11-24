import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./CSS/Login.css"; // Importa el archivo CSS específico
import LeftSide from "../components/leftSide";
import Preferences from "../components/Preferences";
import FinalizePreferences from "../components/FinalizePreferences";

const RegisterPreferencias = () => {
    const [step, setStep] = useState(1);
  
    const handleNext = () => {
      setStep(2);
    };
  
    const handleFinalize = () => {
      // Aquí puedes guardar los datos o hacer algo con ellos
      console.log("Preferencias finalizadas");
    };
  
    return (

      <Container fluid className="">
        <Row>
          <Col xs={6} className="left-side">
            <LeftSide />
          </Col>
          <Col xs={6} className="right-side">
            <h1>Bienvenida Karla!</h1>
            <p className="textIngreso">Selecciona tus preferencias</p>
            <div>
              {step === 1 && <Preferences className="backgroundPreference" onNext={handleNext} />}
              {step === 2 && <FinalizePreferences onFinalize={handleFinalize} />}
            </div>
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default RegisterPreferencias;