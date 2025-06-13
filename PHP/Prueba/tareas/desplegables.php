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
    // ----------------------------------------------------------------------------------------
    $sql = "SELECT      id, nombre
            FROM        grupos  
            WHERE       fidUsuario = :idUsuario
            ORDER BY    nombre ASC";

    $parametros = [":idUsuario" => $idUsuario];
    $stmt = $pdo->prepare($sql);
    $stmt->execute($parametros);
    $grupos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // ----------------------------------------------------------------------------------------

    $sql = "SELECT      id, nombre 
            FROM        prioridades
            ORDER BY    prioridad ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $prioridades = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ----------------------------------------------------------------------------------------

    $sql = "SELECT      id, nombre 
            FROM        estadosTareas
            ORDER BY    id ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $estados = $stmt->fetchAll(PDO::FETCH_ASSOC);

 
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Se ha recuperado los desplegables correctamente ",
        "grupos" => $grupos,
        "prioridades" => $prioridades,
        "estados" => $estados

    ]);


    
} catch (Exception $e) {
    writeLog("error " . $e->getMessage());
    echo json_encode(["status" => "error", "mensaje" => "Error al recuperar la tarea: " . $e->getMessage()]);
    
}
?>
