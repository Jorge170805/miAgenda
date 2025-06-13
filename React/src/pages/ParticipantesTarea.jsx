import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/groups.css";  

let timer; // Timer para limpiar mensajes automáticamente

const ParticipantesTarea = () => {
  const navigate = useNavigate();  // Hook para navegación
  const { id } = useParams();      // Obtener el id de la tarea desde la URL
  // Estado principal para tarea y participantes
  const [data, setData] = useState({ tarea: { nombre: "", descripcion: "" }, listado: [] });    
  const [listado, setListado] = useState([]); // Lista de participantes
  const [email, setEmail] = useState("");     // Email para añadir participante
  const [mensaje, setMensaje] = useState(""); // Mensajes de error o éxito

  // Al montar el componente, setea título y carga participantes
  useEffect(() => {
    document.title = "Participantes de la Tarea";
    getListado();
  }, []);

  // Función para obtener lista de participantes desde backend
  const getListado = () => {
    const formData = new FormData();
    formData.append("id", id);

    fetch("http://localhost/PHP/Prueba/tareas/participantes/list.php", {
      credentials: "include",
      body: formData,
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setData(data);         // Guardar datos de tarea y participantes
          setListado(data.listado); // Guardar solo listado para uso local
        } else {
          alert("❌ " + data.mensaje); // Error en backend
        }
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  // Añadir nuevo participante a la tarea
  function add() {
    let emailTmp = email.trim().toUpperCase();

    if (emailTmp === "") {
      setMensajeAndClean("❌ El campo email no puede estar vacio");
      return;
    }
    if (nombreDuplicado(emailTmp)) {
      setMensajeAndClean("❌ El participante ya existe");
      return;
    }

    // No dejar que el usuario se añada a sí mismo
    let emailUsuario = JSON.parse(localStorage.getItem("usuario"));
    emailUsuario = emailUsuario.email.trim().toUpperCase();
    if (emailTmp === emailUsuario) {
      setMensajeAndClean("❌ No te puedes añadirte a ti mismo");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("email", email);

    fetch("http://localhost/PHP/Prueba/tareas/participantes/insert.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setMensajeAndClean("✅ " + data.mensaje); // Mensaje de éxito
          setEmail("");      // Limpiar input email
          getListado();      // Refrescar listado de participantes
        } else {
          setMensajeAndClean("❌ " + data.mensaje); // Mensaje error backend
        }
      })
      .catch((error) => {
        console.error(error);
        setMensajeAndClean("❌ Error al conectar con el servidor");
      });
  }

  // Borrar participante de la tarea
  function del(id) {
    setEmail(""); // Limpiar input

    const formData = new FormData();
    formData.append("id", id);

    fetch("http://localhost/PHP/Prueba/tareas/participantes/delete.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setMensajeAndClean("✅ " + data.mensaje);
          getListado(); // Refrescar listado
        } else {
          setMensajeAndClean("❌ " + data.mensaje);
        }
      })
      .catch((error) => {
        console.error(error);
        setMensajeAndClean("❌ Error al conectar con el servidor");
      });
  }

  // Comprueba si el email ya está en la lista de participantes
  function nombreDuplicado(email) {
    for (let elemento of listado) {
      if (elemento.email.toUpperCase() === email.toUpperCase()) {
        return true;
      }
    }
    return false;
  }

  // Volver a la lista de tareas
  function volver() {
    navigate("/listTareas/false");
  }

  // Muestra mensaje y limpia después de 3 segundos
  const setMensajeAndClean = (message) => {
    setMensaje(message);
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      setMensaje("");
    }, 3000);
  };

  return (
    <Layout>
      <div className="container">
        <h1>Participantes de la Tarea {data.tarea.nombre}</h1>
        <br />
        <b>Descripción: </b>
        <textarea value={data.tarea.descripcion} disabled />
        <div className="content">
          {/* Si no es solo consulta, mostrar input para añadir email */}
          {!data.soloConsulta && (
            <div className="func">
              Email:{" "}
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={50}
                style={{ width: "500px" }}
              />
              <button onClick={add}>Añadir</button>
            </div>
          )}
          {/* Mostrar mensaje solo si no es solo consulta */}
          {!data.soloConsulta && mensaje && <p className="message">{mensaje}</p>}
          <br />
          <div className="list">
            <p>Participantes</p>
            <hr />
            <table className="tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Mostrar propietario de la tarea */}
                <tr className="fila">
                  <td>
                    <b>{data.tarea.propietarioNombre}</b>
                  </td>
                  <td>
                    <b>{data.tarea.propietarioEmail}</b>
                  </td>
                  <td></td>
                </tr>
                {/* Mostrar participantes */}
                {data.listado.map((e) => (
                  <tr className="fila" key={e.id}>
                    <td>{e.nombre}</td>
                    <td>{e.email}</td>
                    <td>
                      {/* Mostrar botón borrar si no es solo consulta o si el usuario es el mismo */}
                      {(!data.soloConsulta || data.idUsuarioLogado === e.fidUsuario) && (
                        <button className="btn-icon" title="Borrar" onClick={() => del(e.id)}>
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br />
            <button onClick={volver}>Volver</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ParticipantesTarea;
