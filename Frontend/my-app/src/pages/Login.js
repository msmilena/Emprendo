import React, { useState } from "react"; // Importa React y el hook useState para manejar el estado
import { useNavigate } from "react-router-dom"; // Permite la navegación entre rutas
import { Container, Row, Col } from "react-bootstrap"; // Componentes de diseño responsivo de React-Bootstrap
import Button from "../components/Button"; // Componente personalizado de botón
import FormControl from "../components/FormControl"; // Componente personalizado de campo de formulario
import "./CSS/Login.css"; // Archivo CSS para estilos específicos
import { auth } from "../firebaseConfig"; // Importa la configuración de Firebase
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"; // Métodos de autenticación de Firebase
import LeftSide from "../components/leftSide"; // Componente para la parte izquierda del diseño

function Login() {
  // Estados para manejar las entradas y datos del usuario
  const [email, setEmail] = useState(""); // Estado para almacenar el correo del usuario
  const [password, setPassword] = useState(""); // Estado para almacenar la contraseña del usuario
  const [error, setError] = useState(""); // Estado para manejar mensajes de error
  const [location, setLocation] = useState(null); // Estado para almacenar la ubicación del usuario
  const [userId, setUserId] = useState(""); // Estado para almacenar el ID del usuario autenticado
  const navigate = useNavigate(); // Hook para manejar la navegación

  // Función para obtener la ubicación del usuario
  const getLocation = () => {
    if (navigator.geolocation) {
      // Si el navegador soporta geolocalización
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Almacena la latitud y longitud
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude }); // Guarda la ubicación en el estado

          // Almacena las coordenadas en el almacenamiento local para acceso futuro
          localStorage.setItem("latitude", latitude);
          localStorage.setItem("longitude", longitude);

          console.log("Ubicación obtenida con alta precisión");
        },
        (error) => {
          // Maneja errores si no se puede obtener la ubicación
          console.error("No se pudo obtener la ubicación.");
          console.error(`Código de error: ${error.code}, Mensaje: ${error.message}`);
        },
        {
          enableHighAccuracy: true, // Alta precisión (puede usar GPS en dispositivos móviles)
          timeout: 20000, // Tiempo máximo de espera (20 segundos)
          maximumAge: 0, // No usa datos en caché, solicita datos actuales
        }
      );
    } else {
      console.error("La geolocalización no es compatible con este navegador.");
    }
  };

  // Función para manejar el inicio de sesión con correo y contraseña
  const handleLogin = async () => {
    console.log("login"); // Mensaje en consola para depuración
    try {
      // Autentica al usuario usando Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Obtiene el usuario autenticado
      const token = await user.getIdToken(); // Obtiene el token del usuario

      // Envía el token al servicio externo para validación
      const response = await fetch("https://emprendo-usuario-service-26932749356.us-west1.run.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Especifica que los datos se envían como JSON
        },
        body: JSON.stringify({ token }), // Envía el token en el cuerpo de la solicitud
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setUserId(user.uid);
        localStorage.setItem("userId", user.uid);
        localStorage.setItem("user", JSON.stringify(data));
        getLocation(); // Obtener la ubicación del usuario
        // Redirigir al usuario según el tipo
        if (data.tipo === "emprendedor") {
          navigate(`/homeEmprendedor/${user.uid}`);
        } else {
          navigate("/home");
        }
      } else {
        // Muestra un mensaje de error si la validación falla
        setError(data.message);
      }
    } catch (error) {
      // Maneja errores durante la autenticación
      setError(error.message);
    }
  };

  // Función para manejar el inicio de sesión con Google
  const handleGoogleLogin = async () => {
    console.log("google login"); // Mensaje en consola para depuración
    const provider = new GoogleAuthProvider(); // Configura el proveedor de Google
    try {
      // Autentica al usuario con Google usando Firebase
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user; // Obtiene el usuario autenticado
      console.log("User logged in with Google:", user);

      const token = await user.getIdToken(); // Obtiene el token del usuario

      // Envía el token al servicio externo para validación
      const response = await fetch("https://emprendo-usuario-service-26932749356.us-west1.run.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Especifica que los datos se envían como JSON
        },
        body: JSON.stringify({ token }), // Envía el token en el cuerpo de la solicitud
      });

      const data = await response.json(); // Procesa la respuesta del servidor

      if (data.success) {
        setUserId(user.uid);
        localStorage.setItem("userId", user.uid);
        localStorage.setItem("user", JSON.stringify(data));
        getLocation(); // Obtener la ubicación del usuario
        // Redirigir al usuario según el tipo
        if (data.tipo === "emprendedor") {
          navigate(`/homeEmprendedor/${user.uid}`);
        } else {
          navigate("/home");
        }
      } else {
        // Muestra un mensaje de error si la validación falla
        setError(data.message);
      }
    } catch (error) {
      // Maneja errores durante la autenticación con Google
      console.error("Error logging in with Google:", error);
      setError(error.message);
    }
  };

  // Función para redirigir al usuario a la página de registro
  const handleRegister = () => {
    navigate("/rolSelect"); // Redirige a la página de selección de rol
  };

  return (
    <Container fluid className="">
      <Row>
        {/* Sección izquierda con el componente LeftSide */}
        <Col xs={5} className="left-side">
          <LeftSide />
        </Col>

        {/* Sección derecha con el formulario de inicio de sesión */}
        <Col xs={7} className="right-side">
          <h1>¡Inicia sesión en Emprendo!</h1>
          <p className="textIngreso">Ingresa tus credenciales</p>
          <form>
            {/* Campo para ingresar el correo electrónico */}
            <FormControl
              controlId="formBasicEmail"
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Correo Electrónico"
            />

            {/* Campo para ingresar la contraseña */}
            <FormControl
              controlId="formBasicPassword"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Contraseña"
            />

            {/* Muestra un mensaje de error si existe */}
            {error && <p className="text-danger">{error}</p>}

            {/* Botones para iniciar sesión, iniciar con Google y registrarse */}
            <Button onClick={handleLogin}>Iniciar Sesión</Button>
            <Button variant="orange" onClick={handleGoogleLogin}>Iniciar con Google</Button>
            <Button className="transparent-button" onClick={handleRegister}>Registrarse</Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login; // Exporta el componente Login para su uso en otras partes de la aplicación
