<?php
// Configura los encabezados para permitir peticiones desde frontend (localhost:3000)
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
    // Obtiene el id del estado a borrar desde POST
    $id = $_POST["id"];

    // Verifica si hay tareas que usan este estado
    $sql = "SELECT count(*) FROM tareas WHERE fidEstado = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id]);
    $count = $stmt->fetchColumn();

    // Si el estado esta en uso, devuelve error y detiene ejecucion
    if ($count > 0) { 
        echo json_encode([
            "status" => "error",
            "mensaje" => "Error al borrar el estado, porque que esta en uso"
        ]);
        exit();
    }

    // Si no esta en uso, lo elimina de la tabla estadosTareas
    $sql = "DELETE FROM estadosTareas WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id]);

    // Devuelve respuesta exitosa
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Estado borrado correctamente"
    ]);
} catch (PDOException $e) {
    // En caso de error, devuelve el mensaje correspondiente
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al borrar el estado: " . $e->getMessage()
    ]);
}
?>
