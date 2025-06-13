<?php
// Fichero de conexion con la base de datos
$host = "localhost";
$db = "agenda";
$user = "root";
$password = "root";
$now = date("Y-m-d H:i:s");

// Intenta establecer la conexion usando PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Si hay un error, termina la ejecucion y muestra el mensaje
    die("Error de conexion: " . $e->getMessage());
}
?>
