import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import LeftSide from "../components/leftSide";
import CardRol from "../components/CardRol";
import userIcon from "../assets/users_icon.png"; // Importa las imágenes
import storeIcon from "../assets/store_icon.png";

function TipoPerfil() {
  return (
    <Container fluid className="vh-100 d-flex align-items-center">
      <Row className="w-100">
        <Col xs={12} md={6} className="left-side">
          <LeftSide />
        </Col>
        <Col
          xs={12}
          md={6}
          className="right-side 
          d-flex 
          flex-column 
          justify-content-center 
          align-items-center"
        >
          <h1>Registro</h1>
          <p className="textIngreso">Completa tus datos</p>
          <Container className="d-flex justify-content-between">
            <Row className="mb-4 ">
              <Col>
                <CardRol imgSrc={userIcon} text="Cliente" />
              </Col>
            </Row>
            <Row>
              <Col>
                <CardRol imgSrc={storeIcon} text="Emprendedor" />
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default TipoPerfil;
