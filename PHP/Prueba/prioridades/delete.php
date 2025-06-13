<?php
// Encabezados para permitir peticiones desde frontend con credenciales
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Verifica sesion y permisos de administrador
include("../check_session.php");
include("../check_admin.php");
include("../conexion.php");

try {
    // Obtiene el ID desde el POST
    $id = $_POST["id"];

    // Verifica si la prioridad esta en uso por alguna tarea
    $sql = "SELECT count(*) FROM tareas WHERE fidPrioridad = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id]);
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        // Si la prioridad esta en uso, no se puede eliminar
        echo json_encode([
            "status" => "error",
            "mensaje" => "Error al borrar la prioridad, porque que esta en uso"
        ]);
        exit();
    }

    // Elimina la prioridad si no esta en uso
    $sql = "DELETE FROM prioridades WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id]);

    // Respuesta de exito
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Prioridad borrada correctamente"
    ]);
} catch (PDOException $e) {
    // Manejo de errores de base de datos
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al borrar la prioridad: " . $e->getMessage()
    ]);
}
?>
