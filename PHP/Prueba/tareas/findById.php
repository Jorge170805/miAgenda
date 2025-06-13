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
    $id = $_POST["id"];

    $sql = "SELECT * FROM tareas WHERE id = :id";

    $parametros = [":id" => $id];

    $stmt = $pdo->prepare($sql);
    $stmt->execute($parametros);
    $elemento = $stmt->fetch(PDO::FETCH_ASSOC);

    $elemento["soloConsulta"] = true;
    if($idUsuario == $elemento["fidUsuario"]){
        $elemento["soloConsulta"] = false;
    }

 
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Se han recuperado el elemento con id " . $id,
        "elemento" => $elemento
    ]);


    
} catch (Exception $e) {
    writeLog("error " . $e->getMessage());
    echo json_encode(["status" => "error", "mensaje" => "Error al recuperar la tarea: " . $e->getMessage()]);
    
}
?>
