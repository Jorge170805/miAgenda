import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/groups.css";

const BLANCO = "#ffffff";  // color blanco por defecto para fondo
const NEGRO = "#000000";   // color negro por defecto para texto

let timer;  // timer para limpiar mensajes automáticamente

const Groups = () => {
  // Estados React para manejar datos y UI
  const [listado, setListado] = useState([]);       // listado de grupos
  const [mode, setMode] = useState("ADD");          // modo ADD o UPDATE
  const [id, setId] = useState(null);                // id grupo a modificar
  const [nombre, setNombre] = useState("");          // nombre del grupo
  const [colorFondo, setColorFondo] = useState(BLANCO); // color de fondo
  const [colorTexto, setColorTexto] = useState(NEGRO);  // color de texto
  const [mensaje, setMensaje] = useState("");        // mensaje para el usuario

  // Al montar el componente, cambia título y carga listado de grupos
  useEffect(() => {
    document.title = "Grupos";
    getListado();
  }, []);

  // Obtiene listado desde backend PHP
  const getListado = () => {
    fetch("http://localhost/PHP/Prueba/grupos/list.php", { credentials: "include" })
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

  // Añade nuevo grupo validando duplicados y campo vacío
  const add = () => {
    if (nombre.trim().length === 0) {
      setMensajeAndClean("❌ El campo grupo no puede estar vacío");
      return;
    }
    if (nombreDuplicado(null,nombre)) {
      setMensajeAndClean("❌ El grupo ya existe");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("colorFondo", colorFondo);
    formData.append("colorTexto", colorTexto);

    fetch("http://localhost/PHP/Prueba/grupos/insert.php", {
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

    cancelUpd();  // limpia el formulario y vuelve a modo ADD
  };

  // Elimina grupo por id
  const delGroup = (id) => {
    // limpia formulario antes de eliminar
    setId(null);
    setNombre("");
    setColorFondo(BLANCO);
    setColorTexto(NEGRO);

    const formData = new FormData();
    formData.append("id", id);

    fetch("http://localhost/PHP/Prueba/grupos/delete.php", {
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

  // Prepara el formulario para editar un grupo
  const upd = (id, nombre, colorFondo, colorTexto) => {
    setMode("UPDATE");
    setId(id);
    setNombre(nombre);
    setColorFondo(colorFondo);
    setColorTexto(colorTexto);
  };

  // Guarda cambios en grupo existente validando duplicados
  const saveUpd = () => {
    if (nombre.trim().length === 0) {
      setMensajeAndClean("❌ El campo grupo no puede estar vacío");
      return;
    }
    if (nombreDuplicado(id,nombre)) {
      setMensajeAndClean("❌ El grupo ya existe");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("nombre", nombre);
    formData.append("colorFondo", colorFondo);
    formData.append("colorTexto", colorTexto);

    fetch("http://localhost/PHP/Prueba/grupos/update.php", {
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

    cancelUpd();
  };

  // Cancela la edicion y resetea formulario
  const cancelUpd = () => {
    setMode("ADD");
    setId(null);
    setNombre("");
    setColorFondo(BLANCO);
    setColorTexto(NEGRO);
  };

  // Comprueba si el nombre del grupo ya existe, excluyendo el id actual si se modifica
  function nombreDuplicado(id, nombre){
    nombre = nombre.trim().toUpperCase();
    for(let elemento of listado){
      if(
        (id == null && nombre === elemento.nombre.trim().toUpperCase())
        ||
        (id != null && nombre === elemento.nombre.trim().toUpperCase() && id !== elemento.id)
      ){
        return true;
      }
    }
    return false;
  }

  // Muestra un mensaje temporal (3s) y limpia el timer previo si existe
  const setMensajeAndClean = (message) => {
    setMensaje(message);
    if(timer != null){
      clearTimeout(timer);
    }
    timer = setTimeout(() => { setMensaje("") }, 3000);
  }

  // Render del componente: formulario y tabla de grupos
  return (
    <Layout>
      <div className="container">
        <h1>Mantenimiento de Grupos</h1>
        <br/>
        <div className="content">
          <div className="func">
            Grupo:{" "}
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={50}
            />
            Color Fondo:{" "}
            <input
              type="color"
              value={colorFondo}
              onChange={(e) => setColorFondo(e.target.value)}
            />
            Color Texto:{" "}
            <input
              type="color"
              value={colorTexto}
              onChange={(e) => setColorTexto(e.target.value)}
            />
            {mode === "ADD" && <button onClick={add}>➕ Añadir</button>}
            {mode === "UPDATE" && <button onClick={saveUpd} className="edit-save">Guardar</button>}
            {mode === "UPDATE" && <button onClick={cancelUpd} className="edit-cancel">Cancelar</button>}
          </div>
          {mensaje && <p className="message">{mensaje}</p>}
          <div className="list">
            <br/>
            <p>Grupos</p>
            <hr />
            <table className="tabla">
              <thead>
                <tr>
                  <th className="th-grupo">Mis Grupos</th>
                  <th className="th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listado.map((e) => (
                  <tr className="fila" key={e.id}>
                    <td
                      className="td-nombre"
                      style={{
                        backgroundColor: e.colorFondo,
                        color: e.colorTexto,
                      }}
                    >
                      {e.nombre}
                    </td>
                    <td className="td-acciones">
                      <button className="btn-icon" onClick={() => delGroup(e.id)}>🗑️</button>
                      <button className="btn-icon" onClick={() => upd(e.id, e.nombre, e.colorFondo, e.colorTexto)}>✏️</button>
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

export default Groups;
