<?php 

include("log.php");

// Inicia la sesion o la continua
session_start();

// Verifica si el usuario esta autenticado
if (!isset($_SESSION['usuario_id'])) {
    // Si no hay sesion activa, redirige al login
    header("Location: http://localhost:3000/login"); 
    exit();
}
?>