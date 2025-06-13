import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/groups.css";  

let timer; // Variable para controlar tiempo de mensajes temporales

const Priorities = () => {
  // Estados para lista de prioridades, modo (añadir o actualizar), id, nombre, prioridad y mensajes
  const [listado, setListado] = useState([]);
  const [mode, setMode] = useState("ADD");  // Modo puede ser "ADD" o "UPDATE"
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Al cargar el componente, poner el título de la pestaña
  useEffect(() => {
    document.title = "Prioridades";
  }, []);

  // Función para obtener el listado de prioridades desde backend
  const getListado = () => {
    fetch("http://localhost/PHP/Prueba/prioridades/list.php", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setListado(data.listado); // Guardar la lista en el estado
        } else {
          alert("❌ " + data.mensaje); // Mostrar error si algo falla
        }
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  // Cargar listado cuando el componente se monta
  useEffect(() => {
    getListado();
  }, []);

  // Añadir nueva prioridad
  function add() {
    // Validaciones
    if (nombre.trim().length === 0) {
      setMensajeAndClean("❌ El campo nombre no puede estar vacio");
      return;
    }
    if (nombreDuplicado(null, nombre)) {
      setMensajeAndClean("❌ El nombre de la prioridad ya existe");
      return;
    }
    if (prioridad.length === 0) {
      setMensajeAndClean("❌ El campo prioridad no puede estar vacio");
      return;
    }
    setPrioridad(parseInt(prioridad));
    if (prioridad < 1 || prioridad > 1000) {
      setMensajeAndClean("❌ El campo prioridad debe estar en el rango [1 - 1000]");
      return;
    }

    // Preparar datos para enviar
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("prioridad", prioridad);

    // Enviar petición para añadir prioridad
    fetch("http://localhost/PHP/Prueba/prioridades/insert.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setMensajeAndClean("✅ " + data.mensaje);
          getListado(); // Actualizar lista
        } else {
          setMensajeAndClean("❌ " + data.mensaje);
        }
      })
      .catch((error) => {
        console.error(error);
        setMensajeAndClean("❌ Error al conectar con el servidor");
      });
    cancelUpd(); // Limpiar campos y modo después de añadir
  }

  // Borrar prioridad por id
  function del(id) {
    setId(null);
    setNombre("");
    setPrioridad("");

    const formData = new FormData();
    formData.append("id", id);

    fetch("http://localhost/PHP/Prueba/prioridades/delete.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setMensajeAndClean("✅ " + data.mensaje);
          getListado(); // Actualizar lista después de borrar
        } else {
          setMensajeAndClean("❌ " + data.mensaje);
        }
      })
      .catch((error) => {
        console.error(error);
        setMensajeAndClean("❌ Error al conectar con el servidor");
      });
  }

  // Preparar el formulario para actualizar una prioridad existente
  function upd(id, nombre, prioridad) {
    setMode("UPDATE");
    setId(id);
    setNombre(nombre);
    setPrioridad(prioridad);
  }

  // Guardar los cambios de la prioridad actualizada
  function saveUpd() {
    // Validaciones (igual que en add)
    if (nombre.trim().length === 0) {
      setMensajeAndClean("❌ El campo nombre no puede estar vacio");
      return;
    }
    if (nombreDuplicado(id, nombre)) {
      setMensajeAndClean("❌ El nombre de la prioridad ya existe");
      return;
    }
    if (prioridad.length === 0) {
      setMensajeAndClean("❌ El campo prioridad no puede estar vacio");
      return;
    }
    setPrioridad(parseInt(prioridad));
    if (prioridad < 1 || prioridad > 1000) {
      setMensajeAndClean("❌ El campo prioridad debe estar en el rango [1 - 1000]");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("nombre", nombre);
    formData.append("prioridad", prioridad);

    fetch("http://localhost/PHP/Prueba/prioridades/update.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setMensajeAndClean("✅ " + data.mensaje);
          getListado(); // Refrescar lista con datos actualizados
        } else {
          setMensajeAndClean("❌ " + data.mensaje);
        }
      })
      .catch((error) => {
        console.error(error);
        setMensajeAndClean("❌ Error al conectar con el servidor");
      });

    cancelUpd(); // Volver al modo añadir y limpiar campos
  }

  // Cancelar actualización y limpiar formulario
  function cancelUpd() {
    setMode("ADD");
    setId(null);
    setNombre("");
    setPrioridad("");
  }

  // Comprobar si el nombre ya existe (excluyendo el id actual si hay)
  function nombreDuplicado(id, nombre) {
    nombre = nombre.trim().toUpperCase();
    for (let elemento of listado) {
      if (
        (id == null && nombre === elemento.nombre.trim().toUpperCase()) ||
        (id != null && nombre === elemento.nombre.trim().toUpperCase() && id !== elemento.id)
      ) {
        return true; // Nombre duplicado encontrado
      }
    }
    return false; // No hay duplicado
  }

  // Mostrar mensaje temporal y limpiarlo luego de 3 segundos
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
        <h1>Mantenimiento de Prioridades</h1>
        <br />
        <div className="content">
          <div className="func">
            {/* Inputs para nombre y prioridad */}
            Nombre:{" "}
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={50}
            />
            Prioridad:{" "}
            <input
              type="number"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
              min="1"
              max="1000"
            />
            {/* Botones de añadir o guardar según modo */}
            {mode === "ADD" && <button onClick={add}>➕ Añadir</button>}
            {mode === "UPDATE" && (
              <>
                <button className="edit-save" onClick={saveUpd}>
                  Guardar
                </button>
                <button className="edit-cancel" onClick={cancelUpd}>
                  Cancelar
                </button>
              </>
            )}
          </div>
          {/* Mensaje de éxito o error */}
          {mensaje && <p className="message">{mensaje}</p>}
          <br />
          <div className="list">
            <p>Prioridades</p>
            <hr />
            <table className="tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Prioridad</th>
                  <th className="th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Listado de prioridades con botones editar y borrar */}
                {listado.map((e) => (
                  <tr className="fila" key={e.id}>
                    <td>{e.nombre}</td>
                    <td>{e.prioridad}</td>
                    <td className="td-acciones">
                      <button
                        className="btn-icon"
                        onClick={() => upd(e.id, e.nombre, e.prioridad)}
                        title="editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => del(e.id)}
                        title="borrar"
                      >
                        🗑️
                      </button>
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

export default Priorities;
