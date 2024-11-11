import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Button from "../components/Button";
import FormControl from "../components/FormControl";
import "./CSS/Login.css"; // Importa el archivo CSS específico
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(""); // Define el estado para userId
  const navigate = useNavigate();  

  const handleLogin = async () => {
    console.log("login");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      setUserId(user.uid);
      localStorage.setItem("userId", user.uid);
      // Redirigir al usuario a la página de inicio
      navigate("/home"); // Ajusta la ruta según tu configuración
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("google login");
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      setUserId(user.uid);
      localStorage.setItem("userId", user.uid);
      // Redirigir al usuario a la página de inicio
      navigate("/EmprendoHome"); // Ajusta la ruta según tu configuración
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = () => {
    navigate("/rolSelect");
  };

  return (
    <Container fluid className="">
      <Row>
        <Col>
          <form>
            <FormControl
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormControl
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>
              Iniciar Sesión
            </Button>
            <Button onClick={handleGoogleLogin}>
              Iniciar Sesión con Google
            </Button>
            <Button onClick={handleRegister}>Registrarse</Button>
            {error && <p>{error}</p>}
            {userId && <p>Usuario ID: {userId}</p>}
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
