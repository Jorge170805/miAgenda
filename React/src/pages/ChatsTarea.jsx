import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/chat.css";  

let timer;

const ChatsTarea = () => {
  const chatRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); // id de la tarea
  const [idMsg, setIdMsg] = useState(null);
  const [mode, setMode] = useState("ADD");
  const [data, setData] = useState({ tarea: { nombre: "", descripcion: "" }, listado: [] });
  const [listado, setListado] = useState([]);
  const [msg, setMsg] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Al cargar el componente
  useEffect(() => {
    document.title = "Chat de la tarea";
    getListado(); // obtiene el chat

    // Refresca el listado cada 3 segundos
    setInterval(() => getListado(), 3000);
  }, []);

  // Auto-scroll al fondo del chat cuando se actualiza
  useEffect(() => {
    const div = chatRef.current;
    if (div) {
      div.scrollTop = div.scrollHeight;
    }
  }, [data.listado]);

  // Obtiene los mensajes del chat
  const getListado = () => {
    const formData = new FormData();
    formData.append("id", id);

    fetch("http://localhost/PHP/Prueba/tareas/chats/list.php", {
      credentials: "include",
      method: "POST",
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setData(data);
          setListado(data.listado);
        } else {
          alert("❌ " + data.mensaje);
        }
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  // Envia un nuevo mensaje
  function add() {
    if (msg.trim() == "") {
      setMensajeAndClean("❌ El campo mensaje no puede estar vacio");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("msg", msg);

    fetch("http://localhost/PHP/Prueba/tareas/chats/insert.php", {
      method: "POST",
      body: formData,
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setMensajeAndClean("✅ " + data.mensaje);
          setMsg("");
          getListado();
        } else {
          setMensajeAndClean("❌ " + data.mensaje);
        }
      })
      .catch(() => {
        setMensajeAndClean("❌ Error al conectar con el servidor");
      });

    cancelUpd(); // reinicia modo
  }

  // Elimina un mensaje
  function del(idMsg) {
    setMsg("");

    const formData = new FormData();
    formData.append("idMsg", idMsg);

    fetch("http://localhost/PHP/Prueba/tareas/chats/delete.php", {
      method: "POST",
      body: formData,
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setMensajeAndClean("✅ " + data.mensaje);
          getListado();
        } else {
          setMensajeAndClean("❌ " + data.mensaje);
        }
      })
      .catch(() => {
        setMensajeAndClean("❌ Error al conectar con el servidor");
      });
  }

  // Prepara para editar
  const upd = (idMsg, mensaje) => {
    setMode("UPDATE");
    setIdMsg(idMsg);
    setMsg(mensaje);
  };

  // Cancela edicion
  const cancelUpd = () => {
    setMode("ADD");
    setIdMsg(null);
    setMsg("");
  };

  // Guarda la edicion
  const saveUpd = () => {
    if (msg.trim() == "") {
      setMensajeAndClean("❌ El campo mensaje no puede estar vacio");
      return;
    }

    const formData = new FormData();
    formData.append("idMsg", idMsg);
    formData.append("msg", msg);

    fetch("http://localhost/PHP/Prueba/tareas/chats/update.php", {
      method: "POST",
      body: formData,
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setMensajeAndClean("✅ " + data.mensaje);
          getListado();
        } else {
          setMensajeAndClean("❌ " + data.mensaje);
        }
      })
      .catch(() => {
        setMensajeAndClean("❌ Error al conectar con el servidor");
      });

    cancelUpd();
  };

  // Navegar hacia atras
  function volver() {
    navigate("/listTareas/false");
  }

  // Muestra mensaje temporal
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
        <div className="content">
          <h1>Chat de la Tarea {data.tarea.nombre}</h1>
          <br />
          <b>Descripcion: </b>
          <textarea value={data.tarea.descripcion} disabled />
          <div ref={chatRef} className="chat">
            {data.listado.map((e) => {
              let estilos = "mensaje";
              let mensajeMio = e.idUsuario == data.idUsuarioLogado;
              if (mensajeMio) {
                estilos += " miMensaje";
              }

              return (
                <div className={estilos} key={e.idMsg}>
                  <div className="headerMensaje">
                    <h4>
                      <span title={e.usuarioEmail}>{e.usuarioNombre}</span>
                    </h4>
                    {mensajeMio && e.borrado == 0 && (
                      <div>
                        <button className="btn-icon" title="Editar" onClick={() => upd(e.idMsg, e.mensaje)}>
                          ✏️
                        </button>
                        <button className="btn-icon" title="Borrar" onClick={() => del(e.idMsg)}>
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                  <p>{e.mensaje}</p>
                  <p>{e.editado == 1 && "Editado - "}{e.fecha}</p>
                </div>
              );
            })}
          </div>
          <br />
          <div className="input-buttons">
            <div className="input-buttons-left">
              Mensaje:{" "}
              <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} />
              {mode === "ADD" && <button onClick={add}>Enviar</button>}
              {mode === "UPDATE" && <button onClick={saveUpd} className="edit-save">Guardar</button>}
              {mode === "UPDATE" && <button onClick={cancelUpd} className="edit-cancel">Cancelar</button>}
            </div>
            <div className="input-buttons-right">
              <button onClick={volver} className="boton-volver">Volver</button>
            </div>
          </div>
          <br />
          {mensaje && <div className="mensaje-flotante">{mensaje}</div>}
        </div>
      </div>
    </Layout>
  );
};

export default ChatsTarea;
