<?php
header('Content-Type: application/json');

require_once 'config/db.php';

// instance database
$database = new Database();
$db = $database->connect();

// data dari form
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validasi input
$errors = [];
if (empty($name)) {
    $errors['name'] = 'Name is required';
}
if (empty($email)) {
    $errors['email'] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format';
}
if (empty($message)) {
    $errors['message'] = 'Message is required';
}

// Jika ada error, kembalikan response error
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'errors' => $errors
    ]);
    exit;
}

// Simpan ke database
try {
    $query = 'INSERT INTO messages (name, email, subject, message) VALUES (:name, :email, :subject, :message)';
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':subject', $subject);
    $stmt->bindParam(':message', $message);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Your message has been sent successfully!'
        ]);
    } else {
        throw new Exception('Failed to save message');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while sending your message: ' . $e->getMessage()
    ]);
}
?>