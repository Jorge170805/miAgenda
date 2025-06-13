<?php
// Encabezados para permitir peticiones desde frontend (localhost:3000)
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Verifica que haya sesion activa y que el usuario sea admin
include("../check_session.php");
include("../check_admin.php");
include("../conexion.php");

try {
    // Recoge los datos enviados por POST
    $id = $_POST["id"];
    $nombre = $_POST["nombre"];
    $avisos = $_POST["avisos"];

    // Actualiza el estado con el nuevo nombre y valor de avisos
    $sql = "UPDATE estadosTareas SET nombre = :nombre, avisos = :avisos WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":id" => $id,
        ":nombre" => $nombre,
        ":avisos" => $avisos
    ]);

    // Devuelve respuesta de exito
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Estado modificado correctamente"
    ]);
} catch (PDOException $e) {
    // Devuelve mensaje de error en caso de fallo
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al modificar el estado: " . $e->getMessage()
    ]);
}
?>
