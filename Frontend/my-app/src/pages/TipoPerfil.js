import React from "react"; // Importa React para crear el componente
import { useNavigate } from "react-router-dom"; // Hook para manejar la navegación entre rutas
import { Container, Row, Col } from "react-bootstrap"; // Componentes de Bootstrap para diseño responsivo
import LeftSide from "../components/leftSide"; // Componente para la sección izquierda
import CardRol from "../components/CardRol"; // Componente para las tarjetas de rol
import userIcon from "../assets/users_icon.png"; // Importa la imagen para el rol de Cliente
import storeIcon from "../assets/store_icon.png"; // Importa la imagen para el rol de Emprendedor

function TipoPerfil() {
  const navigate = useNavigate(); // Inicializa el hook para navegación

  // Función para manejar el clic en "Cliente"
  const handleClienteClick = () => {
    navigate("/registerUsuario"); // Navega a la página de registro para usuarios (clientes)
  };

  // Función para manejar el clic en "Emprendedor"
  const handleEmprendedorClick = () => {
    navigate("/registerEmprendedor"); // Navega a la página de registro para emprendedores
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center">
      {/* Contenedor principal que ocupa toda la altura de la ventana y centra verticalmente su contenido */}
      <Row className="w-100">
        {/* Fila que ocupa el ancho completo */}
        <Col xs={12} md={6} className="left-side">
          {/* Columna para la sección izquierda */}
          <LeftSide /> {/* Componente reutilizable para mostrar información o diseño adicional */}
        </Col>
        <Col
          xs={12}
          md={6}
          className="
          right-side 
          d-flex 
          flex-column 
          justify-content-center 
          align-items-center"
        >
          {/* Columna para la sección derecha */}
          <h1>Registro</h1>
          <p className="textIngreso">Completa tus datos</p>
          <Container className="d-flex justify-content-between">
            {/* Contenedor para las tarjetas de rol */}
            <Row className="mb-4">
              {/* Primera fila para la tarjeta de Cliente */}
              <Col>
                <CardRol
                  imgSrc={userIcon} // Imagen del ícono para Cliente
                  text="Cliente" // Texto que aparece en la tarjeta
                  onClick={handleClienteClick} // Maneja el clic en la tarjeta
                />
              </Col>
            </Row>
            <Row>
              {/* Segunda fila para la tarjeta de Emprendedor */}
              <Col>
                <CardRol
                  imgSrc={storeIcon} // Imagen del ícono para Emprendedor
                  text="Emprendedor" // Texto que aparece en la tarjeta
                  onClick={handleEmprendedorClick} // Maneja el clic en la tarjeta
                />
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default TipoPerfil; // Exporta el componente para ser utilizado en otras partes de la aplicación
