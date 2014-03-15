<?php

// Large data, you may need to set these variables in mysql client. Probably possible in phpMyAdmin but I don't know how. 
// At command prompt type: mysql coderspool 
// And then: 

// set global net_buffer_length=1000000; 
// set global max_allowed_packet=1000000000;

system("mysql <reset_db.sql coderspool -uroot --max_allowed_packet=100M");

require_once("LoremIpsum.class.php");
require_once("DB.php");

$db = new DB();

$db->GenerateTags();
$db->GenerateCategories();
$db->GenerateRandomData(1000);

?>
