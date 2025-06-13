<?php
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include("../../check_session.php");
include("../../conexion.php");

try {
    
    $idUsuario = $_SESSION["usuario_id"];
    $id = $_POST["id"];
    $email = $_POST["email"];

    $sql = "SELECT id FROM usuarios WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":email" => $email]);
    $idUsuarioParticipante = $stmt->fetchColumn();

    if($idUsuarioParticipante == null){
        echo json_encode(["status" => "error", "mensaje" => "Error el email no corresponde a ningun usuario"]);
        exit();
    }
    
    $sql = "INSERT INTO participantes (fidTarea,fidUsuario,fecha) VALUES (:id,:idUsuarioParticipante,now())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id,":idUsuarioParticipante" => $idUsuarioParticipante]);
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Participante creado correctamente"
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al crear el participante: " . $e->getMessage()]);
}
?>
