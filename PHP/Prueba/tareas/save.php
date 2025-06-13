<?php
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include("../check_session.php");
include("../conexion.php");

try {
    $idUsuario = $_SESSION["usuario_id"];
    $elemento = json_decode($_POST["elemento"], true);

    // Normalizar fechaFin
    if ($elemento["fechaFin"] === "") {
        $elemento["fechaFin"] = null;
    }

    $parametros = [
            ":fidUsuario"   => $idUsuario,
            ":nombre"       => $elemento["nombre"],
            ":descripcion"  => $elemento["descripcion"],
            ":fechaInicio"  => $elemento["fechaInicio"],
            ":fechaFin"     => $elemento["fechaFin"],
            ":fidGrupo"     => $elemento["fidGrupo"],
            ":fidPrioridad" => $elemento["fidPrioridad"],
            ":fidEstado"    => $elemento["fidEstado"]
        ];

    $msg="";
    // INSERT
    if ($elemento["id"] == 0) {
        $sql = "INSERT INTO tareas(fidUsuario, nombre, descripcion, fechaInicio, fechaFin, fidGrupo, fidPrioridad, fidEstado)
                VALUES (:fidUsuario, :nombre, :descripcion, :fechaInicio, :fechaFin, :fidGrupo, :fidPrioridad, :fidEstado)";

               
        $msg = "Tarea creada correctamente";
        

    // UPDATE
    } else {
        $sql = "UPDATE tareas 
                SET nombre = :nombre,
                    descripcion = :descripcion,
                    fechaInicio = :fechaInicio,
                    fechaFin = :fechaFin,
                    fidGrupo = :fidGrupo,
                    fidPrioridad = :fidPrioridad,
                    fidEstado = :fidEstado
                WHERE id = :id AND fidUsuario = :fidUsuario";

        $parametros[":id"] = $elemento["id"];

        $msg = "Tarea modificada correctamente";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($parametros);

    echo json_encode([
        "status" => "ok",
        "mensaje" => $msg
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al modificar la tarea: " . $e->getMessage()
    ]);
}
?>
