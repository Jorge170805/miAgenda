<?php
error_reporting(E_ERROR);

header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include("../check_session.php");
include("../conexion.php");

try {
    $idUsuario = $_SESSION["usuario_id"];
    $parametros = [":idUsuario" => $idUsuario];

    if(isset($_POST["filtros"])){
        $filtros = json_decode($_POST["filtros"],true);
    }
    writeLog("fi:" . $filtros["fechaInicio"]);
    

    $sql = "SELECT t.id as idTarea, t.nombre as tarea, t.fechaInicio, t.fechaFin, g.nombre as grupo, e.nombre as estado, p.nombre as prioridad, u.email as propietario,  
            CASE WHEN t.fidUsuario = v.fidUsuario THEN 1 ELSE 0 END as propias, g.colorFondo, g.colorTexto
            FROM v_tareas_x_usuarios v  INNER JOIN tareas 			t ON t.id = v.fidTarea
						                INNER JOIN grupos 			g ON g.id = t.fidGrupo
                                        INNER JOIN estadostareas 	e ON e.id = t.fidEstado
                                        INNER JOIN prioridades 		p ON p.id = t.fidPrioridad
                                        INNER JOIN usuarios			u ON u.id = t.fidUsuario
            WHERE v.fidUsuario = :idUsuario ";

    if($filtros["tarea"] != null && $filtros["tarea"] != ""){
        $sql = $sql . " AND (t.nombre LIKE :tarea ) ";
        $parametros[":tarea"] = "%" . $filtros["tarea"] . "%";
    }

    if($filtros["idGrupo"] != null && $filtros["idGrupo"] != ""){
        $sql = $sql . " AND (g.id = :idGrupo ) ";
        $parametros[":idGrupo"] = $filtros["idGrupo"];
    }

    if($filtros["idEstado"] != null && $filtros["idEstado"] != ""){
        $sql = $sql . " AND (e.id = :idEstado ) ";
        $parametros[":idEstado"] = $filtros["idEstado"];
    }

    if($filtros["idPrioridad"] != null && $filtros["idPrioridad"] != ""){
        $sql = $sql . " AND (p.id = :idPrioridad ) ";
        $parametros[":idPrioridad"] = $filtros["idPrioridad"];
    }

    
    if($filtros["fechaInicio"] != null && $filtros["fechaInicio"] != ""){
        $sql = $sql . " AND (t.fechaInicio >= :fechaInicio ) ";
        $parametros[":fechaInicio"] = $filtros["fechaInicio"];
    }

    if($filtros["fechaFin"] != null && $filtros["fechaFin"] != ""){
        $sql = $sql . " AND (t.fechaInicio <= :fechaFin ) ";
        $parametros[":fechaFin"] = $filtros["fechaFin"];
    }

    $sql .= " order by t.fechaInicio desc";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($parametros);

    $listado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Se han recuperado " . count($listado) . " tareas",
        "listado" => $listado
    ]);


    
} catch (Exception $e) {
    writeLog("error " . $e->getMessage());
    echo json_encode(["status" => "error", "mensaje" => "Error al recuperar las tareas: " . $e->getMessage()]);
    
}
?>
