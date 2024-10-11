import React from "react";
import { Container, Card, Nav, Navbar, Button } from "react-bootstrap";
import "./CSS/Incio.css";
function Inicio() {
  return (
    <Container fluid className="">
      <Card className="cardNav">
        <Card.Body>
          <Navbar expand="lg">
            <Container id="container_nav">
              <div className="img_icono_2"></div>
              <Navbar.Brand className="brandNav" href="">
                Emprendo
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="">Inicio</Nav.Link>
                  <Nav.Link href="">Emprendimientos</Nav.Link>
                  <Nav.Link href="">Sobre Nosotros</Nav.Link>
                </Nav>
              </Navbar.Collapse>
              <Navbar.Collapse className="justify-content-end">
                <Button className="IniciarSesionBtn">Iniciar Sesión</Button>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Inicio;
