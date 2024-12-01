import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Button from "../components/Button";
import FormControl from "../components/FormControl";
import "./CSS/Login.css"; // Importa el archivo CSS específico
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import LeftSide from "../components/leftSide";

function RegisterUsuario() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Validar que el email esté disponible
      const checkResponse = await fetch(`https://emprendo-usuario-service-26932749356.us-west1.run.app/auth/check_email?email=${email}`);
      const checkData = await checkResponse.json();
      if (!checkData.success) {
        setError(checkData.message);
        return;
      }

      // Crear usuario con Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User registered:", user);

      // Enviar datos del usuario a la API para registrarlo en Firestore
      const response = await fetch("https://emprendo-usuario-service-26932749356.us-west1.run.app/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.uid,
          nombre,
          email,
          password,
          tipo: "cliente", 
          tipoAuth: 0
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Usuario registrado en Firestore:", data.message);
        // Redirigir al usuario a la página de inicio o a otra página
        navigate("/login"); // Ajusta la ruta según tu configuración
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setError(error.message);
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log("User registered with Google:", user);

      // Enviar datos del usuario a la API para registrarlo en Firestore
      const response = await fetch("https://emprendo-usuario-service-26932749356.us-west1.run.app/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.uid,
          nombre: user.displayName,
          email: user.email,
          password: "", // No necesitas la contraseña aquí
          tipo: "cliente", // Puedes ajustar esto según tu lógica de negocio
          tipoAuth: 1
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Usuario registrado en Firestore:", data.message);
        // Redirigir al usuario a la página de inicio o a otra página
        navigate("/login"); // Ajusta la ruta según tu configuración
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error registering user with Google:", error);
      setError(error.message);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <Container fluid className="">
      <Row>
        <Col xs={6} className="left-side">
          <LeftSide />
        </Col>
        <Col xs={6} className="right-side">
          <h1>Registro</h1>
          <p className="textIngreso">Completa tus datos</p>
          <form>
            <FormControl
              controlId="formBasicName"
              type="text"
              placeholder="Ingresa tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
            {error && <p className="text-danger">{error}</p>}
            <Button variant="orange" onClick={handleRegister}>
              Registrarme
            </Button>
            <Button variant="orange" onClick={handleGoogleRegister}>
              Registrarme con Google
            </Button>
            <Button variant="transparent" onClick={handleLoginRedirect}>
              Ya tengo una cuenta
            </Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterUsuario;