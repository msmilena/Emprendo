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
import LeftSide from "../components/leftSide"; // Importa el componente LeftSide

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null); // Define el estado para la ubicación
  const [userId, setUserId] = useState(""); // Define el estado para userId
  const navigate = useNavigate();  

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          // Almacena las coordenadas en localStorage para acceso futuro
          localStorage.setItem("latitude", latitude);
          localStorage.setItem("longitude", longitude);
          
          console.log("Ubicación obtenida con alta precisión");
        },
        (error) => {
          console.error("No se pudo obtener la ubicación. Por favor, permite el acceso a la ubicación en tu navegador.");
          console.error(`Código de error: ${error.code}, Mensaje: ${error.message}`);
        },
        {
          enableHighAccuracy: true, // Solicita alta precisión, puede usar GPS en móviles
          timeout: 20000, // Aumenta el tiempo de espera a 20 segundos para mayor precisión
          maximumAge: 0 // No usar datos de ubicación en caché para obtener datos actualizados
        }
      );
    } else {
      console.error("La geolocalización no es compatible con este navegador.");
    }
  };
  const handleLogin = async () => {
    console.log("login");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      const response = await fetch("https://emprendo-usuario-service-26932749356.us-west1.run.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (data.success) {
        setUserId(user.uid);
        localStorage.setItem("userId", user.uid);
        localStorage.setItem("user", JSON.stringify({ uid: user.uid, name: user.displayName || user.email }));
        getLocation(); // Obtener la ubicación del usuario
        // Redirigir al usuario a la página de inicio
        navigate("/"); // Ajusta la ruta según tu configuración
      } else {
        setError(data.message);
      }
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
      const token = await user.getIdToken();
      const response = await fetch("https://emprendo-usuario-service-26932749356.us-west1.run.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (data.success) {
        setUserId(user.uid);
        localStorage.setItem("userId", user.uid);
        localStorage.setItem("user", JSON.stringify({ uid: user.uid, name: user.displayName || user.email }));
        getLocation(); // Obtener la ubicación del usuario
        // Redirigir al usuario a la página de inicio
        navigate("/"); // Ajusta la ruta según tu configuración
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = () => {
    navigate("/rolSelect");
  }

  return (
    <Container fluid className="">
      <Row>
        <Col xs={6} className="left-side">
          <LeftSide />
        </Col>
        <Col xs={6} className="right-side">
          <h1>¡Inicia sesión en Emprendo!</h1>
          <p className="textIngreso">Ingresa tus credenciales</p>
          <form>
            <FormControl
              controlId="formBasicEmail"
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Correo Electrónico"
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
            <Button onClick={handleLogin}>Iniciar Sesión</Button>
            <Button variant="orange" onClick={handleGoogleLogin}>Iniciar con Google</Button>
            <Button className="transparent-button" onClick={handleRegister}>Registrarse</Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;