<?php
// Set CORS headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Only POST requests are allowed']);
    exit;
}

// Get the raw POST data and decode it
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate required fields
if (!isset($data['email']) || !isset($data['phone'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Email and phone are required fields']);
    exit;
}

// Extract data from the request
$firstName = $data['firstName'] ?? '';
$lastName = $data['lastName'] ?? '';
$phone = $data['phone'] ?? '';
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$company = $data['company'] ?? 'Not provided';
$website = $data['website'] ?? 'Not provided';
$comments = $data['comments'] ?? 'No comments';
$smsConsent = isset($data['smsConsent']) && $data['smsConsent'] ? 'Yes' : 'No';

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Recipient email (site owner)
$to = 'lennoxlocaladsflyer@gmail.com';

// Email to site owner
$subject = 'New Spot Reservation from Lennox Local Ads Flyer Website';

// Set up HTML email with styling
$ownerMessage = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h2 { color: #1976D2; border-bottom: 2px solid #1976D2; padding-bottom: 10px; }
        h3 { color: #1976D2; }
        .info { margin-bottom: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; }
        .value { margin-left: 10px; }
    </style>
</head>
<body>
    <div class='container'>
        <h2>New Reservation Request</h2>
        <div class='info'>
            <div class='field'><span class='label'>Name:</span> <span class='value'>$firstName $lastName</span></div>
            <div class='field'><span class='label'>Phone:</span> <span class='value'>$phone</span></div>
            <div class='field'><span class='label'>Email:</span> <span class='value'>$email</span></div>
            <div class='field'><span class='label'>Company:</span> <span class='value'>$company</span></div>
            <div class='field'><span class='label'>Website:</span> <span class='value'>$website</span></div>
            <div class='field'><span class='label'>SMS consent:</span> <span class='value'>$smsConsent</span></div>
        </div>
        <h3>Comments:</h3>
        <p>$comments</p>
    </div>
</body>
</html>
";

// Email headers for HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: $email" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";

// Send email to owner
$ownerMailSent = mail($to, $subject, $ownerMessage, $headers);

// Send confirmation email to customer
$customerSubject = 'Your Lennox Local Ads Flyer Spot Reservation';
$customerMessage = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h2 { color: #1976D2; border-bottom: 2px solid #1976D2; padding-bottom: 10px; }
        h3 { color: #1976D2; }
        .info { margin-bottom: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; }
        .value { margin-left: 10px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <h2>Thank you for your reservation, $firstName!</h2>
        <p>We've received your request to secure a spot in our upcoming direct mail campaign.</p>
        <p>A member of our team will contact you shortly to confirm the details.</p>
        
        <h3>Your submitted information:</h3>
        <div class='info'>
            <div class='field'><span class='label'>Name:</span> <span class='value'>$firstName $lastName</span></div>
            <div class='field'><span class='label'>Phone:</span> <span class='value'>$phone</span></div>
            <div class='field'><span class='label'>Email:</span> <span class='value'>$email</span></div>
            <div class='field'><span class='label'>Company:</span> <span class='value'>$company</span></div>
            <div class='field'><span class='label'>Comments:</span> <span class='value'>$comments</span></div>
        </div>
        
        <div class='footer'>
            <p>If you have any questions, please contact us at:</p>
            <p>Phone: (562) 282-9498</p>
            <p>Email: lennoxlocaladsflyer@gmail.com</p>
            <p>Thank you for choosing Lennox Local Ads Flyer!</p>
        </div>
    </div>
</body>
</html>
";

// Customer email headers (send from the site owner to the customer)
$customerHeaders = "MIME-Version: 1.0" . "\r\n";
$customerHeaders .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$customerHeaders .= "From: Lennox Local Ads Flyer <lennoxlocaladsflyer@gmail.com>" . "\r\n";
$customerHeaders .= "Reply-To: lennoxlocaladsflyer@gmail.com" . "\r\n";

// Send email to customer
$customerMailSent = mail($email, $customerSubject, $customerMessage, $customerHeaders);

// Prepare response
if ($ownerMailSent && $customerMailSent) {
    http_response_code(200); // Success
    echo json_encode([
        'success' => true,
        'message' => 'Your reservation has been submitted successfully. We\'ll contact you shortly to confirm your spot!'
    ]);
} elseif ($ownerMailSent) {
    // At least the owner notification was sent
    http_response_code(200); // Still consider it a success
    echo json_encode([
        'success' => true,
        'message' => 'Your reservation has been submitted successfully. We\'ll contact you shortly to confirm your spot!'
    ]);
} else {
    // Both emails failed to send
    http_response_code(500); // Server error
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send your reservation. Please try again or contact us directly at (562) 282-9498.'
    ]);
}