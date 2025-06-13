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
    // Obtiene el id del estado que se quiere borrar (desde POST)
    $id = $_POST["id"];

    // Verifica si hay invitados que usan este estado
    $sql = "SELECT count(*) FROM invitados WHERE fidEstado = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id]);
    $count = $stmt->fetchColumn();

    // Si el estado esta en uso, no se puede borrar
    if ($count > 0) { 
        echo json_encode(["status" => "error", "mensaje" => "Error al borrar el estado, porque que esta en uso"]);
        exit();
    }

    // Si no esta en uso, borra el estado
    $sql = "DELETE FROM estadosInvitados WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id]);

    // Respuesta exitosa
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Estado borrado correctamente"
    ]);
} catch (PDOException $e) {
    // En caso de error, devuelve mensaje con el detalle
    echo json_encode(["status" => "error", "mensaje" => "Error al borrar el estado: " . $e->getMessage()]);
}
?>
