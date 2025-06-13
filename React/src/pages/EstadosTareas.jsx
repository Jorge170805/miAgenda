import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/groups.css"; // Estilos generales reutilizados

let timer; // Variable para temporizador de mensajes

const EstadosTareas = () => {
  // Estados del componente
  const [listado, setListado] = useState([]); // Lista de estados actuales
  const [mode, setMode] = useState("ADD"); // Modo actual: "ADD" o "UPDATE"
  const [id, setId] = useState(null); // ID del estado en edicion
  const [nombre, setNombre] = useState(""); // Nombre del estado
  const [avisos, setAvisos] = useState(0); // Si el estado requiere aviso (0 o 1)
  const [mensaje, setMensaje] = useState(""); // Mensaje de notificacion

  // Al montar el componente
  useEffect(() => {
    document.title = "Estados Tareas";
    getListado(); // Obtener lista inicial
  }, []);

  // Trae la lista de estados desde el servidor
  const getListado = () => {
    fetch("http://localhost/PHP/Prueba/estadosTareas/list.php", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
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

  // Agrega un nuevo estado
  const add = () => {
    if (nombre.trim().length === 0) {
      setMensajeAndClean("❌ El campo nombre no puede estar vacio");
      return;
    }

    if (nombreDuplicado(null, nombre)) {
      setMensajeAndClean("❌ El nombre del estado ya existe");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("avisos", avisos);

    fetch("http://localhost/PHP/Prueba/estadosTareas/insert.php", {
      method: "POST",
      body: formData,
      credentials: "include",
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
      .catch((error) => {
        console.error(error);
        setMensajeAndClean("❌ Error al conectar con el servidor");
      });

    cancelUpd(); // Limpiar el formulario
  };

  // Elimina un estado (si su id > 4)
  const del = (id) => {
    setId(null);
    setNombre("");
    setAvisos(0);

    const formData = new FormData();
    formData.append("id", id);

    fetch("http://localhost/PHP/Prueba/estadosTareas/delete.php", {
      method: "POST",
      body: formData,
      credentials: "include",
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
      .catch((error) => {
        console.error(error);
        setMensajeAndClean("❌ Error al conectar con el servidor");
      });
  };

  // Carga datos de un estado para editar
  const upd = (id, nombre, avisos) => {
    setMode("UPDATE");
    setId(id);
    setNombre(nombre);
    setAvisos(avisos);
  };

  // Guarda la edicion de un estado
  const saveUpd = () => {
    if (nombre.trim().length === 0) {
      setMensajeAndClean("❌ El campo nombre no puede estar vacio");
      return;
    }

    if (nombreDuplicado(id, nombre)) {
      setMensajeAndClean("❌ El nombre del estado ya existe");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("nombre", nombre);
    formData.append("avisos", avisos);

    fetch("http://localhost/PHP/Prueba/estadosTareas/update.php", {
      method: "POST",
      body: formData,
      credentials: "include",
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
      .catch((error) => {
        console.error(error);
        setMensajeAndClean("❌ Error al conectar con el servidor: " + error);
      });

    cancelUpd(); // Volver al modo agregar
  };

  // Cancela la edicion y limpia el formulario
  const cancelUpd = () => {
    setMode("ADD");
    setId(null);
    setNombre("");
    setAvisos(0);
  };

  // Valida si el nombre ya existe (en modo nuevo o edicion)
  function nombreDuplicado(id, nombre) {
    nombre = nombre.trim().toUpperCase();
    for (let elemento of listado) {
      if (
        (id == null && nombre === elemento.nombre.trim().toUpperCase()) ||
        (id != null && nombre === elemento.nombre.trim().toUpperCase() && id !== elemento.id)
      ) {
        return true;
      }
    }
    return false;
  }

  // Muestra mensajes temporales en pantalla
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
        <h1>Mantenimiento de Estados (Tareas)</h1>
        <br />
        <div className="content">
          {/* Formulario */}
          <div className="func">
            Nombre:{" "}
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={50}
            />
            Avisar:{" "}
            <input
              type="checkbox"
              checked={avisos == 1}
              onChange={(e) => setAvisos(e.target.checked ? 1 : 0)}
            />
            {/* Botones segun el modo */}
            {mode === "ADD" && <button onClick={add}>➕ Añadir</button>}
            {mode === "UPDATE" && (
              <>
                <button onClick={saveUpd} className="edit-save">
                  Guardar
                </button>
                <button onClick={cancelUpd} className="edit-cancel">
                  Cancelar
                </button>
              </>
            )}
          </div>

          {/* Mensaje de validacion */}
          {mensaje && <p className="message">{mensaje}</p>}

          <br />
          {/* Tabla de estados */}
          <div className="list">
            <p>Estados</p>
            <hr />
            <table className="tabla">
              <thead>
                <tr>
                  <th className="th-grupo">Nombre</th>
                  <th className="th-grupo">Avisar</th>
                  <th className="th-borrar">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listado.map((e) => (
                  <tr className="fila" key={e.id}>
                    <td>{e.nombre}</td>
                    <td>
                      <input type="checkbox" checked={e.avisos == 1} readOnly />
                    </td>
                    <td className="td-acciones">
                      {/* Boton de editar */}
                      <button
                        className="btn-icon"
                        onClick={() => upd(e.id, e.nombre, e.avisos)}
                        title="editar"
                      >
                        ✏️
                      </button>
                      {/* Boton de eliminar (solo si id > 4) */}
                      {e.id > 4 && (
                        <button
                          className="btn-icon"
                          onClick={() => del(e.id)}
                          title="borrar"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EstadosTareas;
