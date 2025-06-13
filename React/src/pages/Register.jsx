import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/styles.css";  // Asegúrate de importar el archivo CSS

/********************************************************************************************************** */
function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  
//-------------------------------------------------------------------------------------------------
  // Cambiar el título de la página cuando se renderiza el componente
  useEffect(() => {
    document.title = "Registro"; // Cambia el título aquí
  }, []);  // Solo se ejecuta una vez cuando el componente se monta


//-------------------------------------------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    formData.append('password', password);

      fetch("http://localhost/PHP/Prueba/registro.php", {method: "POST", body: formData,credentials:"include"})
      .then((response)=>response.json())
      .then((data)=>{
        if (data.status === "ok") {
          setMensaje("✅ " + data.mensaje);

          // Redirigir al login
          setTimeout(() => {navigate("/login");}, 2000); // Espera 2 segundos antes de redirigir
        } else {
          setMensaje("❌ " + data.mensaje);
        }
      })
      .catch((error)=>{
        console.error(error);
        setMensaje("❌ Error al conectar con el servidor");
      });

  };
  //-------------------------------------------------------------------------------------------------

  return (
    <div className="register-container">
      <h1 className="register-title">Registro</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
        <button type="submit" className="submit-btn">
          Registrarse
        </button>
      </form>

      {mensaje && <p className="message">{mensaje}</p>}
      <p className="register-link">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aqui</Link>
      </p>
    </div>
  );
  //-------------------------------------------------------------------------------------------------
}

/********************************************************************************************************** */

export default Register;
