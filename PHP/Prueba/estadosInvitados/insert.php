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
    // Obtiene el nombre del nuevo estado desde POST
    $nombre = $_POST["nombre"];

    // Inserta el nuevo estado en la tabla estadosInvitados
    $sql = "INSERT INTO estadosInvitados (nombre) VALUES (:nombre)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":nombre" => $nombre]);

    // Respuesta exitosa
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Estado insertado correctamente"
    ]);
} catch (PDOException $e) {
    // En caso de error, devuelve mensaje con el detalle
    echo json_encode(["status" => "error", "mensaje" => "Error al crear el estado: " . $e->getMessage()]);
}
?>
