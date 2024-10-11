// src/components/ProgressSteps.js
import React from "react";
import { ProgressBar, Container, Row, Col } from "react-bootstrap";
import "./CSS/ProgressStep.css"; // Importa el archivo CSS específico

function ProgressSteps({ currentStep }) {
  const steps = [
    { step: 1, label: "Paso 1" },
    { step: 2, label: "Paso 2" },
    { step: 3, label: "Paso 3" },
  ];

  return (
    <Container>
      <Row>
        {steps.map((step, index) => (
          <Col key={index} className="text-center">
            <div
              className={`step ${currentStep === step.step ? "active" : ""}`}
            >
              {step.label}
            </div>
            <ProgressBar
              now={currentStep >= step.step ? 100 : 0}
              className={`mt-2 ${currentStep === step.step ? "progress-bar-orange" : "progress-bar-darkblue"}`}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProgressSteps;
