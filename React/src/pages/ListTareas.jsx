import { useState, useEffect } from "react";
import { useNavigate, useParams} from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/groups.css";

let timer; // variable para controlar el timeout del mensaje

const ListTareas = () => {
  const {clean} = useParams(); // parametro para limpiar filtros
  let [filtros, setFiltros] = useState({}); // filtros de busqueda
  const [listado, setListado] = useState([]); // lista de tareas
  const [mensaje, setMensaje] = useState(""); // mensaje de error o exito
  const navigate = useNavigate(); // para navegar entre rutas
  const [desplegableGrupos,setDesplegableGrupos] = useState([]); // opciones grupo
  const [desplegableEstados,setDesplegableEstados] = useState([]); // opciones estado
  const [desplegablePrioridades,setDesplegablePrioridades] = useState([]); // opciones prioridad
  

  useEffect(() => {
    document.title = "Listado de Tareas"; // cambia titulo de la pagina
    if(clean == "true"){
      localStorage.setItem("filtrosTareas","{}"); // limpia filtros guardados
    }

    const tmp = localStorage.getItem("filtrosTareas"); // lee filtros guardados
    if (tmp != null) {
      const obj = JSON.parse(tmp);
      setFiltros(obj); // carga filtros en estado
      filtros = obj // actualiza variable local (no recomendable)
    }
    getListado(); // carga listado inicial
    getDesplegables(); // carga datos para filtros desplegables
  }, []);

  // obtiene tareas filtradas desde backend
  const getListado = () => {
    const formData = new FormData();
    formData.append("filtros", JSON.stringify(filtros));
  
    fetch("http://localhost/PHP/Prueba/tareas/list.php", {
      credentials: "include",
      body: formData,
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setListado(data.listado); // actualiza lista
        } else {
          alert("❌ " + data.mensaje);
        }
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  const add = () => navigate("/editTarea/0"); // navega a nuevo tarea

  // elimina tarea por id
  const del = (id) => {
    const formData = new FormData();
    formData.append("id", id);

    fetch("http://localhost/PHP/Prueba/tareas/delete.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setMensajeAndClean("✅ " + data.mensaje); // muestra mensaje exito
          getListado(); // recarga listado
        } else {
          setMensajeAndClean("❌ " + data.mensaje); // mensaje error
        }
      })
      .catch((error) => {
        console.error(error);
        setMensajeAndClean("❌ Error al conectar con el servidor"); // mensaje error conexion
      });
  };

  const editar = (id) => {
    navigate("/editTarea/" + id); // navega a editar tarea
  };

  const participantes = (id) => {
    navigate("/participantesTarea/" + id); // navega a participantes
  };
  const chat = (id) => {
    navigate("/chatsTarea/" + id); // navega a chat
  };

  // valida fechas y busca tareas
  const buscar = () => {
    if((filtros.fechaInicio != null || filtros.fechaInicio != "") && 
       (filtros.fechaFin != null || filtros.fechaFin != "")){
      let fi = new Date(filtros.fechaInicio);
      let ff = new Date(filtros.fechaFin);
      if(ff <  fi){
        setMensajeAndClean("❌ " + "La fecha de fin no puede ser menor que la fecha de inicio");
        return;
      }
    }
    localStorage.setItem("filtrosTareas", JSON.stringify(filtros)); // guarda filtros
    getListado(); // actualiza listado
  };

  // muestra mensaje y lo limpia tras 3 segundos
  const setMensajeAndClean = (message) => {
    setMensaje(message);
    if(timer != null){
      clearTimeout(timer);
    }
    timer = setTimeout(() => {setMensaje("")},3000);
  }

  // obtiene opciones para filtros desplegables
  const getDesplegables = () => {

    fetch("http://localhost/PHP/Prueba/tareas/desplegables.php",{credentials:"include",method:"POST"})
    .then((response)=>{
      return response.json(); 
    })
    .then((data)=>{
      if (data.status === "ok") {
        setDesplegableEstados(data.estados);
        setDesplegableGrupos(data.grupos);
        setDesplegablePrioridades(data.prioridades);
      } else {
        alert("❌ " + data.mensaje);
      }
    })
    .catch((error)=>{
      alert(error)
      console.error(error);
    });

  }

  // renderiza una fila del listado
  const rowTarea = (e) => {
    const estilo = e.propias == 1 ? { fontWeight: "bold" } : null;

    return (
      <tr className="fila" style={estilo} key={e.id}>
        <td >{e.tarea}</td>
        <td >{e.fechaInicio}<br/>{e.fechaFin}</td>
        <td style={{backgroundColor: e.colorFondo,color: e.colorTexto,}}>{e.grupo}</td>
        <td >{e.estado}</td>
        <td >{e.prioridad}</td>
        <td >{e.propias == 0 && e.propietario}</td>
        <td className="td-borrar">
          <button className="btn-icon" title="editar" onClick={() => editar(e.idTarea)}>✏️</button>
          {e.propias == 1 && (
            <button className="btn-icon" title="borrar" onClick={() => del(e.idTarea)}>🗑️</button>
          )}
          <button className="btn-icon" title="participantes" onClick={() => participantes(e.idTarea)}>👥</button>
          <button className="btn-icon" title="chat" onClick={() => chat(e.idTarea)}>💬</button>
        </td>
      </tr>
    );
  };

  return (
    <Layout>
      <div className="container">
        <h1>Listado de Tareas</h1>

        <div className="filtros-barra">
          {/* filtros para buscar tareas */}
          <div>
            <label>Nombre:</label><br />
            <input
              type="text"
              value={filtros.tarea || ""}
              onChange={(e) => setFiltros({ ...filtros, tarea: e.target.value })}
            />
          </div>

          <div>
            <label>Fecha Inicio:</label><br />
            <input
              type="datetime-local"
              value={filtros.fechaInicio || ""}
              onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
            />
          </div>

          <div>
            <label>FechaFin:</label><br />
            <input
              type="datetime-local"
              value={filtros.fechaFin || ""}
              onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
            />
          </div>
          
          <div>
            <label>Grupo:</label><br />
            <select value={filtros.idGrupo || ""} onChange={(e) => setFiltros({ ...filtros, idGrupo: e.target.value })}>
              <option value="">...</option>
              {desplegableGrupos.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Estado:</label><br />
            <select value={filtros.idEstado || ""} onChange={(e) => setFiltros({ ...filtros, idEstado: e.target.value })}>
              <option value="">...</option>
              {desplegableEstados.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Prioridad:</label><br />
            <select value={filtros.idPrioridad || ""} onChange={(e) => setFiltros({ ...filtros, idPrioridad: e.target.value })}>
                <option value="">...</option>
                {desplegablePrioridades.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <button onClick={buscar}>🔍 Buscar</button>
          </div>
        </div>
        
        {mensaje && <p className="message">{mensaje}</p>}
        <div className="list">
          <div className="encabezado-tareas">
            <p>Tareas ({listado.length})</p>
            <button onClick={add}>➕ Añadir</button>
          </div>
          
          
          <hr />
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fechas</th>
                <th>Grupo</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Propietario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>{listado.map(rowTarea)}</tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ListTareas;
