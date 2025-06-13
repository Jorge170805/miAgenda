<?php
error_reporting(E_ERROR);

header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include("../../check_session.php");
include("../../conexion.php");

try {
    $idUsuario = $_SESSION["usuario_id"];

    $sql = "SELECT t.id as idTarea, t.nombre as tarea, t.fechaInicio, t.fechaFin, g.nombre as grupo, e.nombre as estado, p.nombre as prioridad, u.email as propietario,  
            CASE WHEN t.fidUsuario = v.fidUsuario THEN 1 ELSE 0 END as propias, g.colorFondo, g.colorTexto
            FROM v_tareas_x_usuarios v  INNER JOIN tareas 			t ON t.id = v.fidTarea
						                INNER JOIN grupos 			g ON g.id = t.fidGrupo
                                        INNER JOIN estadostareas 	e ON e.id = t.fidEstado
                                        INNER JOIN prioridades 		p ON p.id = t.fidPrioridad
                                        INNER JOIN usuarios			u ON u.id = t.fidUsuario
            WHERE v.fidUsuario = :idUsuario
            AND e.avisos = 1
            AND t.fechaInicio <= now() 
            ORDER BY t.fechaInicio DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([":idUsuario" => $idUsuario]);

    $listado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Se han recuperado " . count($listado) . " tareas",
        "listado" => $listado
    ]);


    
} catch (Exception $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al recuperar las tareas: " . $e->getMessage()]);  
}
?>
