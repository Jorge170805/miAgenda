<?php
// Configura los encabezados para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Verifica que la sesion este activa y conecta a la base de datos
include("../check_session.php");
include("../conexion.php");

try {
    // Recoge el ID del grupo a borrar y el ID del usuario en sesion
    $id = $_POST["id"];
    $idUsuario = $_SESSION["usuario_id"];

    // Verifica si hay tareas asociadas al grupo
    $sql = "SELECT count(*) FROM tareas WHERE fidGrupo = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id]);
    $count = $stmt->fetchColumn();

    // Si el grupo esta en uso, no se puede borrar
    if ($count > 0) { 
        echo json_encode([
            "status" => "error",
            "mensaje" => "Error al borrar el grupo, porque que esta en uso"
        ]);
        exit();
    }

    // Borra el grupo si pertenece al usuario logueado
    $sql = "DELETE FROM grupos WHERE id = :id AND fidUsuario = :idUsuario";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":id" => $id,
        ":idUsuario" => $idUsuario
    ]);

    // Respuesta de exito
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Grupo borrado correctamente"
    ]);
} catch (PDOException $e) {
    // Manejo de errores de base de datos
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al borrar el grupo: " . $e->getMessage()
    ]);
}
?>
