import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/login.css";

const Login = () => {
  // Estados para guardar email, contraseña y mensajes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Hook para navegar entre rutas
  const navigate = useNavigate();

  // Cambiar título de la pestaña cuando carga el componente
  useEffect(() => {
    document.title = "Iniciar Sesion";
  }, []);

  // Funcion para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar que recargue la pagina

    // Crear objeto con email y password
    const data = { email, password };

    // Enviar datos al backend con fetch
    fetch("http://localhost/PHP/Prueba/login/login.php", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data), // Convertir a JSON para enviar
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json()) // Leer respuesta como JSON
      .then((data) => {
        // Si la respuesta es OK (login exitoso)
        if (data.status === "ok") {
          setMensaje("✅ " + data.mensaje); // Mostrar mensaje de éxito
          // Redirigir según rol despues de 2 segundos
          setTimeout(() => {
            if (data.usuario.rol === 1) {
              navigate("/avisos");
            } else {
              navigate("/agenda");
            }
          }, 2000);
        } else {
          // Si login fallo, mostrar mensaje de error
          setMensaje("❌ " + data.mensaje);
        }
      })
      .catch((error) => {
        // Si hay error de conexión o fetch
        setMensaje("❌ Error al conectar con el servidor");
        console.error(error);
      });
  };

  return (
    <div className="container">
      <h1>Iniciar sesión</h1>
      {/* Formulario con evento onSubmit */}
      <form onSubmit={handleSubmit} className="login-form">
        {/* Input para email */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)} // Actualizar estado email
        />
        {/* Input para contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)} // Actualizar estado password
        />
        {/* Botón para enviar formulario */}
        <button type="submit" className="submit-btn">Iniciar sesión</button>
      </form>
      {/* Mostrar mensaje de error o éxito */}
      {mensaje && <p className="message">{mensaje}</p>}
      {/* Link para ir a la página de registro */}
      <p>
        ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </div>
  );
};

export default Login;
