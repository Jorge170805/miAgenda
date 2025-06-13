<?php
// Configura encabezados para permitir peticiones desde frontend (localhost:3000)
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Incluye verificaciones de sesion y admin, y la conexion a la base de datos
include("../check_session.php");
include("../check_admin.php");
include("../conexion.php");

try {
    // Obtiene el id y nombre desde POST para actualizar el estado
    $id = $_POST["id"];
    $nombre = $_POST["nombre"];

    // Actualiza el nombre del estado con el id especificado
    $sql = "UPDATE estadosInvitados SET nombre = :nombre WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id, ":nombre" => $nombre]);

    // Respuesta exitosa
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Estado modificado correctamente"
    ]);
} catch (PDOException $e) {
    // En caso de error, devuelve mensaje con el detalle
    echo json_encode(["status" => "error", "mensaje" => "Error al modificar el estado: " . $e->getMessage()]);
}
?>
