<?php
    $password = $_GET['password'];
    $fp = fopen('password.txt', 'r');//opens file in read mode
    $pwd = fread($fp, filesize("password.txt"));  
    fclose($fp); 

    $data = ['data' => ''];
    if($password == $pwd){
        $fp2 = fopen('log.txt', 'r');//opens file in read mode
        $log = fread($fp2, filesize("log.txt"));  
        fclose($fp2); 
        $data = ['data' => $log];
        echo json_encode($data);
        // echo $log;
    }else{
        $data = ['data' => 'Wrong password'];
        echo json_encode($data);
        // echo "Incorrect Password";
    }
?>