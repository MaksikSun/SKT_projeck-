<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail-> CharSet = 'UTF-8';
$mail->setLanguage('en', 'phpmailer/language/');
$mail->IsHTML(true);

//от кого письмо
$mail->setForm('info@fls.guru','From SKT');
//кому письмо
$mail->addAddress('code@fls.guru');
//тема письма
$mail->Subject = 'Hello, it SKT-Group';

//рука
$hand = "Organization";
if($_POST['hand'] == "Individual"){
  $hand = "individual";
}

//тело письма
$body = '<h1>Meet my uper list</h1>';
if(trim(!emoty($_POST['name']))){
  $body.='<p><strong>Name:</strong>'.$_POST['name'].'</p> ';
}
if(trim(!empty($_POST['email']))){
  $body.='<p><strong>E-mail:</strong>'.$_POST['email'].'</p> ';
}
if(trim(!empty($_POST['hand']))){
  $body.='<p><strong>Type:</strong>' .$hand'</p> ';
}
if(trim(!empty($_POST['message']))){
  $body.='<p><strong>Message:</strong>'.$_POST['message'].'</p> ';
}


//добавление файла
if(!empty($_FILES['image']['tmp_name'])){
  //путь загрузки файла
  $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
  // загрузка файла
  if (copy($_FILES['image']['tmp_name'], $filePath)){
    $fileAttach = $filePath;
    $body.='<p><strong>Photo in App</strong></p>';
    $mail->addAttachment($fileAttach);
  }
}

$mail->Body = $body;

//отправка
if(!$mail->send()){
  $message = 'ERROR SENDING';
}else{
  $message = 'Message Send!';
}
$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
 ?>
