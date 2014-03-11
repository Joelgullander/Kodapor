<?php

class DB{

  private $con;

  function __construct() {
    if(!$this->con = mysqli_connect("localhost", "sonix", "coders", "coderspool"))
      $this->ThrowMySqlException();
    if (!$this->con->set_charset("utf8")) {
      printf("Error loading character set utf8: %s\n", $mysqli->error);
    } else {
      printf("Current character set: %s\n", $this->con->character_set_name());
    }
  }

  function __destruct() {
    mysqli_close($this->con);
  }

  private function ThrowMySqlException($sql = null){
    if($sql != null)
      throw new Exception("MySQL error: ".$this->con->error." <br/> Query was: ".$sql);
    else
      throw new Exception("MySQL error: ".$this->con->error);
  }

  private function RandomString($length = 10){
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString; //cheat ftw
  }

  private function RandomNumber($length = 10){
    $characters = '0123456789';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString; //cheat ftw
  }

  private function AddAccount($username, $password, $email, $table){
    //Account stuff
      $AccountSql = "INSERT INTO account (username, email, password, user_table) VALUES ('".$username."', '".$email."', '".$password."', '".$table."');"; 
      $AccountResult = mysqli_query($this->con, $AccountSql);
      if(!$AccountResult){
        //Something went wrong...
        $this->ThrowMySqlException($AccountSql);
      }
  }

  private function DoesUserNameExists($username){
    $sql = "SELECT username FROM account WHERE username = '".$username."' ";
    $res = mysqli_query($this->con, $sql);
    if(!$res){
      echo $this->con->error;
      echo "<br/>";
      $this->ThrowMySqlException($sql);
    }
    if($res->num_rows > 0)
      return true;
    else
      return false;

  }

  public function GenerateRandomData($Entries){
    $FirstNames = array("Peter", "Michael", "Linus", "Ulrik", "Hannah", "Anna", "Sture", "Åke", "Per", "Lena", "Oskar", "Filip", "Joel", "Daniel", "Hampus", "Ellenor", "Johannes", "Camilla", "Gustav", "Oskar", "Anders", "Victoria", "Frida", "Ellinor", "Jakob", "Andreas", "Eric", "Erik", "Johanna", "Simon", "Martin", "Sune", "Pierre", "Pär", "Linda", "Valeria", "Lisa", "Homer");
    $LastNames = array("Lundberg", "Gullander", "Svensson", "Larsson", "Grönlund", "Blomstrand", "Eriksson", "Fagerlin", "Fahlstedt", "Ferm", "Ahlström", "Almlöf", "Boström", "Fernholm", "Borelius", "Dahlgren", "Dahlbäck", "Dalén", "Dahlin", "Berggren", "Gullberg", "Danielsson", "Cederberg", "Cederborg", "Fredriksson", "Frid", "Frisk", "Aulin", "Ahlin", "Asplund", "Lund", "Centerwall", "Simpson");
    $businessRatio = array(0,0,0,0,0,0,0,1,1,1);
    
    $i = 0;
    while($i <= $Entries){

      // user_person stuff

      do {
        $RandFirst = $FirstNames[array_rand($FirstNames, 1)];
        $RandLast = $LastNames[array_rand($LastNames, 1)];
        $Username = $RandFirst.$RandLast;
      } while ($this->DoesUserNameExists($Username));
        
      $Password = $this->RandomString(10);
      $Email = strtolower($RandFirst.'.'.$RandLast)."@gmail.com";
      $Phone = "070".$this->RandomNumber(6);
      $Tax = $businessRatio[array_rand($businessRatio,1)];
      if ($Tax === 1) {
        $Company_name = $RandLast . "s IT";
      }
      else {
        $Company_name = "NULL";
        $Tax = 0;
      }     
      
      $this->AddAccount($Username, $Password, $Email, 'user_person');
      
      $AppliersSql = "INSERT INTO user_person (username, firstname, lastname, company_tax, company_name, phone) VALUES ('".$Username."', '".$RandFirst."', '".$RandLast."', b'".$Tax."', '".$Company_name."','".$Phone."' ) ";
      $ApplierResult = mysqli_query($this->con, $AppliersSql);
      if(!$ApplierResult){
        //Something went wrong...
        $this->ThrowMySqlException($ApplersSql);
      }

      $this->GenerateProfile_Pers($Username);

      $i++;
    }
      

    $Companies = array("Microsoft", "Dell", "HP", "Apple", "Telia", "Sony", "Ikea", "Yellowfish", "Softlayer", "Sydsvenskan", "Aftonbladet", "Metro", "Dynamicdog", "SVT", "Nintendo", "Ica", "Statoil", "Portendo", "Altran", "Samport", "Sandå", "SunannåProductions", "Babybjörn", "Addici", "Irisgruppen", "Exova", "Finansportalen", "Metria", "Mediatec", "Medison", "Transcom", "DragonGate", "Activia", "Cint", "CDON", "Swedpower", "Millhouse");
    foreach ($Companies as $key => $value) {
      
      // user_inc stuff

      $RandFirst = $FirstNames[array_rand($FirstNames, 1)];
      $RandLast = $LastNames[array_rand($LastNames, 1)];

      $Company = $value;
      $Username = $Company . '-' . $RandFirst;
      $Password = $this->RandomString(10);
      $Email = lcfirst($RandFirst) .'.'. lcfirst($RandLast) . "@" . lcfirst($Company) . ".se";   
      $Contact = $RandFirst." ".$RandLast;
      $Phone = "070".$this->RandomNumber(6);
      
      $this->AddAccount($Username, $Password, $Email, 'user_company');
      
      $EmployeeSql = "INSERT INTO user_company (username, name, contact_person, phone) VALUES ('".$Username."', '".$Company."', '".$Contact."', '".$Phone."' ) ";
      $EmployeeResult = mysqli_query($this->con, $EmployeeSql);
      if(!$EmployeeResult){
        //Something went wrong...
        $this->ThrowMySqlException($EmployeeSql);
      }

      $this->GenerateProfile_Inc($Username);
    }
  }

  public function GenerateTags(){
    
    $tags = array(
      // Languages
      "JavaScript","php", "C", "C++", "Java", "Ruby", "Python", "Perl", "Ruby on rails", "Lisp", "Assembler", "Node.js", "Flash", "Pascal","Erlang", 

      // Databases
      "MySQL", "PostgreSQL", "MSSql", "Oracle", "SQLite", "NO Sql", "MariaDB",

      // OS
      "Microsoft", "Windows", "Apple", "Mac", "Unix", "Linux", "FreeBSD", "OpenBSD", "NetBSD", "Solaris", "Android", "iOS",

      // Programvara
      "git", "SAP", 

      // Design
      "Adobe CS", "Illustrator", "Photoshop", "3D Studio", "Gimp", "Blender",

      // Concepts
      "OOP", "Agile", "Scrum", "Extreme Programming", 

      // Fields
      "Frontend", "Backend"
    );

    $sql = "INSERT INTO tag (name) VALUES('" . array_shift($tags) . "')";
    foreach( $tags as $key => $value ){
      $sql .= ",('" . $value . "')";
    }
    $sql .= ";";
    $sqlResult = mysqli_query($this->con, $sql);
    if(!$sqlResult){
      //Something went wrong...
      $this->ThrowMySqlException($sql);
    }
  }

  public function GenerateCategories(){
    
    $categories = array(
      "Systemutveckling", "Mobila plattformar", "Inbyggda system", "Webbutveckling", "Project management", "Spelutveckling", "Reklam", "Design", "Sociala medier", "Multimedia", "Databasadministration"
    );

    $sql = "INSERT INTO category (name) VALUES('" . array_shift($categories) . "')";
    foreach( $categories as $key => $value ){
      $sql .= ",('" . $value . "')";
    }
    $sql .= ";";
    $sqlResult = mysqli_query($this->con, $sql);
    if(!$sqlResult){
      //Something went wrong...
      $this->ThrowMySqlException($sql);
    }
  }

  public function GenerateProfile_Pers($username){
    
    $generator = new LoremIpsumGenerator;

    // Generate random active/visible statuses
    $ratio = array(1,1,1,1,1,1,1,0,0,0);
    $visible = 1;
    $active = $ratio[array_rand($ratio,1)];
    if ($active == 0) {
      $visible = $ratio[array_rand($ratio,1)];
    }

    // Generate random experience
    $exp = rand(0,25);
    if ($exp >=15 && rand(0,100) > 30) {
      $exp -= 10;
    }
    elseif ($exp >= 7 && rand(0,100) > 50) {
      $exp -= 5;
    }

    // FAKE     
    $cv = "NULL";
    $ratio = rand(0,10);
    if ($ratio < 3) {
      $cv = "cvRepo/cv-plaincv.pdf";     
    }
    $image = "imageRepo/profiles/profile-pic-300x291.jpg";
    

    $sql = "INSERT INTO profile_person (username, active, visible, content, snippet, experience, cv, image) VALUES('" . $username . "', b'" . $active . "', b'" . $visible . "', '" . $generator->getContent(150, 'txt') . "', '"  . $generator->getContent(30, 'txt') . "', '" . $exp . "', '". $cv ."', '" . $image . "');";

    $sqlResult = mysqli_query($this->con, $sql);
    if(!$sqlResult){
      //Something went wrong...
      $this->ThrowMySqlException($sql);
    }
  }

  public function GenerateProfile_Inc($username){
    
    static $count = 1;
    if ($count > 25) $count = 1;

    $generator = new LoremIpsumGenerator;

    // Generate random active/visible statuses
    $active = 1;
    $visible = 1;

    // Generate random experience (business_years)
    $exp = rand(0,25);
    if ($exp >=15 && rand(0,100) > 30) {
      $exp -= 10;
    }
    elseif ($exp >= 7 && rand(0,100) > 50) {
      $exp -= 5;
    }

    $image_logo = "imageRepo/logos/logo" . $count . ".png";
    $image_view = "imageRepo/views/corporate_culture.jpg";
    $image_contact = "imageRepo/profiles/profile-pic-300x291.jpg";

    $sql = "INSERT INTO profile_company (username, active, visible, content, snippet, business_years, image_logo, image_view, image_contact) VALUES('" . $username . "', b'" . $active . "', b'" . $visible . "', '" . $generator->getContent(150, 'txt') . "', '"  . $generator->getContent(30, 'txt') . "', '" . $exp . "', '" . $image_logo . "', '" . $image_view . "', '" . $image_contact . "');";

    $sqlResult = mysqli_query($this->con, $sql);
    if(!$sqlResult){
      //Something went wrong...
      $this->ThrowMySqlException($sql);
    }

    $count++;
  }
}

