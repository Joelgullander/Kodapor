<?php
class LoginHandler {
 
  private $pdo;
  private $usertablename;
 
 
  private function initialSetUpMySql(
    // arguments with default values
    // change these if you want
    $host = "localhost",
    $dbname = "coderspool",
    $dbusername = "sonix",
    $dbpassword = "coders",
    $usertablename = "accounts"
  ){
 
    // create our pdo instance
    try {
      $this->pdo = new PDO(
        "mysql:host=$host;dbname=$dbname", 
        $dbusername, 
        $dbpassword,
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING)
      );
    }
    catch (PDOException $e) {
      echo '\nConnection failed: ' . $e->getMessage();
      exit;
    }
/*
    // create our database if it does not exist
    $q = $this -> pdo -> prepare("CREATE DATABASE IF NOT EXISTS $dbname");
    $q -> execute();
*/ 
    // switch to the database
    $q = $this -> pdo -> prepare("USE $dbname");
    $q -> execute();
/*
    // create our user table if it does not exist
    $q = $this -> pdo -> prepare(
      "CREATE TABLE IF NOT EXISTS $usertablename (".
      "id int(11) unsigned NOT NULL AUTO_INCREMENT,".
      "username varchar(255) DEFAULT NULL,".
      "password varchar(255) DEFAULT NULL,".
      "PRIMARY KEY (id))"
    );
    $q -> execute();
*/ 
    // remember user table name as a property
    $this -> usertablename = $usertablename;
  }
 
  public function registerUser($username,$password,$minLen = 3){
    
    // do not accept usernames or passwords below a certain length
    if(strlen($username) < $minLen || strlen($password) < $minLen){
      return false;
    }
 
    // check if the username is already taken
    // then do not accept
    $q = $this -> pdo -> prepare(
      "SELECT COUNT(*) as count FROM $this->usertablename ".
      "WHERE username = '$username' "
    );
    $q -> execute();
    $r = $q -> fetchAll();
    if($r[0]["count"] != 0){
      // user exists so no go
      return false;
    }
 
    // create user
    $q = $this -> pdo -> prepare(
      "INSERT INTO users (username,password) ".
      "VALUES ('$username','$password')"
    );
    $q -> execute();
 
    // automatically login user after registration
    return $this -> login($username,$password);
 
  }
 
  public function login($username,$password){
    $q = $this -> pdo -> prepare(
      "SELECT COUNT(*) as count FROM $this->usertablename ".
      "WHERE username = '$username' && password = '$password'"
    );
    
    // check if login is ok
    $q -> execute();
    $r = $q -> fetchAll();

    if($r[0]["count"] == 0){
      // combination of username and password does not exist
      // so no go
      return false;
    }

    $response = array();

    $q = $this -> pdo -> prepare(
      "SELECT firstname, lastname FROM appliers WHERE username = '$username'"
    );  
    $q -> execute();
    $r = $q -> fetchAll();
    
    $response["firstname"] = $r[0]["firstname"];
    $response["lastname"] = $r[0]["lastname"];
    $response["username"] = $username;

    // store the user in a session variable
    $_SESSION["LoginHandlerCurrentUser"] = $username;
 
    return $response;
  }
 
  public function getUser(){
    // return false if no logged in user
    if (!isset($_SESSION["LoginHandlerCurrentUser"])){
      return false;
    }
    return $_SESSION["LoginHandlerCurrentUser"];
  }
 
  public function logOut(){
 
     // delete user from session variables
     unset($_SESSION["LoginHandlerCurrentUser"]);
 
     // return true to show that we succeeded
     return true;
  }
 
  private function handleRequests(){
 
    // We are lazy and do not want to write $_REQUEST
    // a gazillions times below...

    $json = file_get_contents('php://input');

    // packa upp och tvinga associativ array
    $r = json_decode($json, true);
    // Do nothing if no action is sent
    if(!isset($r["loginHandlerAction"])){return false;}
 
    // Read method/action and username and password
    $action = $r["loginHandlerAction"];
    $username = isset($r["username"]) ? $r["username"] : '';
    $password = isset($r["username"]) ? $r["password"] : '';

    // Call method corresponding to action if it exist
    // echo as json and die (stop running php)
    if (method_exists($this, $action) ){ 
      // $this -> {$action} lets us read the name of the
      // method we want to call from a variable, nifty ;)
      die(json_encode($this->{$action}($username,$password))); 
    } 
 
  }
 
 
  public function __construct(){
 
    // Our constructor, runs when we create a
    // a new LoginHandler
    
    // Session start - needed to be able to use session variables
    session_start();
    
    // Create our PDO instance 
    // and create database and/or table if non existing

    $this -> initialSetUpMySQL();
 
    // Listen to requests to the Loginhandler
    $this -> handleRequests();
 
  }
 
}