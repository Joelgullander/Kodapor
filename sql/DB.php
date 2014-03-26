<?php

class DB{

  private $con;

  function __construct() {
    if(!$this->con = mysqli_connect("localhost", "root", "", "coderspool"))
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

  private function AddAccount($username, $password, $email){
    //Account stuff
      $AccountSql = "INSERT INTO account (username, email, password) VALUES ('".$username."', '".$email."', '".$password."');"; 
      $AccountResult = mysqli_query($this->con, $AccountSql);
      $User_id = mysqli_insert_id($this->con);
      if(!$AccountResult){
        //Something went wrong...
        $this->ThrowMySqlException($AccountSql);
      }
      return $User_id;
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
        $Personal_id = "19" . $this->RandomNumber(8);
      } while ($this->DoesUserNameExists($Username));
        
      $Password = $this->RandomString(10);
      $Email = strtolower($RandFirst.'.'.$RandLast)."@gmail.com";
      $Cell = "070".$this->RandomNumber(7);
      $Phone = "0".$this->RandomNumber(8);
      $Tax = $businessRatio[array_rand($businessRatio,1)];
      if ($Tax == 1) {
        $Company_type = 'Enskild firma';
        $Company_name = $RandLast . "s IT-byrå";
        $org_nr = $Personal_id;
        $Company_size = 1;
      }
      else {
        $Company_type = "NULL";
        $Company_name = "NULL";
        $org_nr = "NULL";
        $Company_size = "NULL";
        $Tax = 0;
      }     
      
      $User_id = $this->AddAccount($Username, $Password, $Email);
      
      $AppliersSql = "INSERT INTO user (user_id, firstname,lastname,personal_id,street_address,postal_code,city,phone,cell_phone,company_tax,company_type,company_name,org_nr,company_size) ".
                     "VALUES ('".$User_id."','".$RandFirst."','".$RandLast."','".$Personal_id."','Kvacksalvargränd 2b','123 45','Ankeborg','".$Phone."','".$Cell."',".$Tax.",'".$Company_type."','".$Company_name."','".$org_nr."','".$Company_size."')";
      $ApplierResult = mysqli_query($this->con, $AppliersSql);
      if(!$ApplierResult){
        //Something went wrong...
        $this->ThrowMySqlException($AppliersSql);
      }

      $this->GenerateProfile_Pers($User_id, $RandFirst.' '.$RandLast);

      $i++;
    }
      

    $Companies = array("Microsoft", "Dell", "HP", "Apple", "Telia", "Sony", "Ikea", "Yellowfish", "Softlayer", "Sydsvenskan", "Aftonbladet", "Metro", "Dynamicdog", "SVT", "Nintendo", "Ica",
     "Statoil", "Portendo", "Altran", "Samport", "Sandå", "SunannåProductions", "Babybjörn", "Addici", "Irisgruppen", "Exova", "Finansportalen", "Metria", "Mediatec", "Medison", "Transcom", 
     "DragonGate", "Activia", "Cint", "CDON", "Swedpower", "Millhouse");
    foreach ($Companies as $key => $value) {
      
      // user_inc stuff

      $RandFirst = $FirstNames[array_rand($FirstNames, 1)];
      $RandLast = $LastNames[array_rand($LastNames, 1)];

      $Company = $value;
      $Username = $Company . '-' . $RandFirst;
      $Password = $this->RandomString(10);
      $Email = lcfirst($RandFirst) .'.'. lcfirst($RandLast) . "@" . lcfirst($Company) . ".se";   
      $Contact = $RandFirst." ".$RandLast;
      $Phone = "888-".$this->RandomNumber(6);
      $Cell = "070-".$this->RandomNumber(6);
      
      $User_id = $this->AddAccount($Username, $Password, $Email);
      
      $EmployeeSql = "INSERT INTO user (user_id, firstname, lastname, personal_id, street_address, postal_code, city, phone, cell_phone, company_tax,company_type,company_name,org_nr,company_size) ".
                     "VALUES ('".$User_id."', '".$RandFirst."','".$RandLast."','".$this->RandomNumber(10)."','Proffsgatan 17','543 21','Krämerfors','".$Phone."','".$Cell."',b'1','Aktiebolag','".$Company.
                      "','".$this->RandomNumber(10)."-".$this->RandomNumber(6)."','".rand(10,150)."')";
      $EmployeeResult = mysqli_query($this->con, $EmployeeSql);
      if(!$EmployeeResult){
        //Something went wrong...
        $this->ThrowMySqlException($EmployeeSql);
      }

      $this->GenerateProfile_Inc($User_id,$Company);
    }
  }

  public function GenerateTags(){
    
    // If adding or deleting to this array, don't forget to change the range of random generator
    // in generateProfile functions below..

    $tags = array(
      // Languages
      "JavaScript","php", "C", "C++", "Java", "Ruby", "Python", "Perl", "Ruby on rails", "Lisp", 
      "Assembler", "Node.js", "Angular.js", "Flash", "Pascal","Erlang", ".NET", "C#", 

      // Databases
      "MySQL", "PostgreSQL", "MSSql", "Oracle", "SQLite", "NO Sql", "MariaDB",

      // OS
      "Microsoft", "Windows", "Apple", "Mac", "Unix", "Linux", "FreeBSD", "OpenBSD", "NetBSD", "Solaris", "Android", "iOS",

      // Programvara
      "git", "SAP", 

      // Design
      "Adobe CS", "Illustrator", "Photoshop", "3D Studio", "Gimp", "Blender",

      // Concepts
      "OOP", "Agile", "Scrum", "Extreme Programming", "Design Patterns", "MVC",

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
    
    // If adding or deleting to this array, don't forget to change the range of random generator
    // in generateProfile functions below..

    $categories = array(
      "Systemutveckling", "Mobila plattformar", "Inbyggda system", "Webbutveckling", "Project management", "Spelutveckling", "Reklam", "Design", "Sociala medier", "Multimedia", "Databasadministration"
    );

    $sql = "INSERT INTO category (name) VALUES('" . array_shift($categories) . "')";

    foreach( $categories as $key => $value ) {
      $sql .= ",('" . $value . "')";
    }

    $sql .= ";";
    $sqlResult = mysqli_query($this->con, $sql);
    if(!$sqlResult){
      //Something went wrong...
      $this->ThrowMySqlException($sql);
    }
  }

  public function GenerateProfile_Pers($User_id, $Name){
    
    $generator = new LoremIpsumGenerator;

    // Generate 1-3 categories and prepare SQL
    $nrCats = rand(1,4);
    $cats = array();
    $tmp;
    $catsql = "INSERT INTO category_profile_map (base,connect) VALUES ";
    for ($i = 0; $i < $nrCats; $i++) {
      do {
        $tmp = rand(1,11);
      } while (in_array($tmp, $cats));
      array_push($cats, $tmp); // Just because we need it if generating advertisement soon
      $catsql .= "(".$cats[$i].",'$User_id')" . ($i + 1 == $nrCats ? "" : ",");
    }
    
    // Generate 1-8 tags and prepare SQL
    $nrTags = rand(1,8);
    $tags = array();
    $tagsql = "INSERT INTO tag_profile_map (base,connect) VALUES ";
    for ($i = 0; $i < $nrTags; $i++) {
      do {
        $tmp = rand(1,48);
      } while (in_array($tmp, $tags));
      array_push($tags, $tmp);
      $tagsql .= "(".$tags[$i].",'$User_id')" . ($i + 1 == $nrTags ? "" : ",");
    }

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
    

    $sql = "INSERT INTO profile (content_id,active_out,visible,display_name,content,snippet,categories,tags,experience,cv,portrait) ".
          "VALUES('" . $User_id . "',b'" . $active . "',b'" . $visible . "','" . $Name . "','" . $generator->getContent(150, 'txt') . 
          "','"  . $generator->getContent(30, 'txt') . "','".implode(',',$cats)."','".implode(',',$tags)."','" . $exp . "','". $cv ."','" . $image . "');";

    $sqlResult = mysqli_query($this->con, $sql);
    if(!$sqlResult){
      //Something went wrong...
      $this->ThrowMySqlException($sql);
    }

    // Profile exists, now insert meta data mappings

    $sqlResult = mysqli_query($this->con, $catsql);
    if(!$sqlResult){
      //Something went wrong...
      $this->ThrowMySqlException($catsql);
    }

    $sqlResult = mysqli_query($this->con, $tagsql);
    if(!$sqlResult){
      //Something went wrong...
      $this->ThrowMySqlException($tagsql);
    }

    // Create an ad per 20% of personal users

    if (rand(0,100)<20) {
      $Content_type = rand(0,100)>50 ? "job_offer" : "service";
      $Heading = $Content_type = "job_offer" ? "Sökes: duktiga programmerare inom " : "Duktig programmerare inom "; 
      $sql = "INSERT INTO advertisement (content_type,user_id,heading,content,snippet,categories,tags,active) VALUES ('".$Content_type."','".
             "$User_id','".$Heading."','".$generator->getContent(150, 'txt')."','".$generator->getContent(30, 'txt')."','".implode(',',$cats)."','".implode(',',$tags)."',b'1');";
      $sqlResult = mysqli_query($this->con, $sql);
      $thisAd = mysqli_insert_id($this->con);
      if(!$sqlResult){
        //Something went wrong...
        $this->ThrowMySqlException($sql);
      }
      $sql = "INSERT INTO category_advertisement_map (base,connect) VALUES ";
      for ($i = 0; $i < $nrCats; $i++) {
        $sql .= "(".$cats[$i].",$thisAd)" . ($i + 1 == $nrCats ? ";" : ",");
      }
      $sqlResult = mysqli_query($this->con, $sql);
      if(!$sqlResult){
        //Something went wrong...
        $this->ThrowMySqlException($sql);
      }
      $sql = "INSERT INTO tag_advertisement_map (base,connect) VALUES ";
      for ($i = 0; $i < $nrTags; $i++) {
        $sql .= "(".$tags[$i].",$thisAd)" . ($i + 1 == $nrTags ? ";" : ",");
      }
      $sqlResult = mysqli_query($this->con, $sql);
      if(!$sqlResult){
        //Something went wrong...
        $this->ThrowMySqlException($sql);
      } 
    }
  }

  public function GenerateProfile_Inc($User_id, $Name){
    
    static $count = 1; // For reusing the 25 logos...
    if ($count > 25) $count = 1;

    $generator = new LoremIpsumGenerator;

    // Generate 1-4 categories
    $nrCats = rand(1,4);
    $cats = array();
    $tmp;
    $catsql = "INSERT INTO category_profile_map (base,connect) VALUES ";
    for ($i = 0; $i < $nrCats; $i++) {
      do {
        $tmp = rand(1,11);
      } while (in_array($tmp, $cats));
      array_push($cats, $tmp); // Just because we need it if generating advertisement soon
      $catsql .= "(".$cats[$i].",'$User_id')" . ($i + 1 == $nrCats ? "" : ",");
    }

    // Generate 1-8 tags
    $nrTags = rand(1,8);
    $tags = array();
    $tagsql = "INSERT INTO tag_profile_map (base,connect) VALUES ";
    for ($i = 0; $i < $nrTags; $i++) {
      do {
        $tmp = rand(1,48);
      } while (in_array($tmp, $tags));
      array_push($tags, $tmp);
      $tagsql .= "(".$tags[$i].",'$User_id')" . ($i + 1 == $nrTags ? "" : ",");
    }

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
    $portrait = "imageRepo/profiles/profile-pic-300x291.jpg";

    $sql = "INSERT INTO profile (content_id,active_out,display_name,content,snippet,categories,tags,experience,portrait,image_logo,image_view) ".
           "VALUES('" . $User_id . "',b'1','" .$Name. "','" . $generator->getContent(150, 'txt') . "','"  . $generator->getContent(30, 'txt') . 
           "','".implode(',',$cats)."','".implode(',',$tags)."','" . $exp . "','" . $portrait . "','" . $image_logo . "','" . $image_view . "');";

    $sqlResult = mysqli_query($this->con, $sql);
    if(!$sqlResult){
      //Something went wrong...
      $this->ThrowMySqlException($sql);
    }

    // Run SQL cats and tags
    $sqlResult = mysqli_query($this->con, $catsql);
    if(!$sqlResult){
      //Something went wrong...
      $this->ThrowMySqlException($catsql);
    }

    $sqlResult = mysqli_query($this->con, $tagsql);
    if(!$sqlResult){
      //Something went wrong...
      $this->ThrowMySqlException($tagsql);
    }

    // generate 3 advertisements per company
    for ($loop = 0; $loop < 3; $loop++) {
      $Content_type = rand(0,100)>50 ? "job_offer" : "service";
      $Heading = $Content_type = "job_offer" ? "Vi söker nu kompetenta medarbetare inom " : "Vi erbjuder tjänster inom "; 
      $sql = "INSERT INTO advertisement (content_type,user_id,heading,content,snippet,categories,tags,active) VALUES ('".$Content_type."','".
             "$User_id','".$Heading."','".$generator->getContent(150, 'txt')."','".$generator->getContent(30, 'txt')."','".implode(',',$cats)."','".implode(',',$tags)."',b'1');";
      $sqlResult = mysqli_query($this->con, $sql);
      $thisAd = mysqli_insert_id($this->con);

      if(!$sqlResult){
        //Something went wrong...
        $this->ThrowMySqlException($sql);
      }
      $sql = "INSERT INTO category_advertisement_map (base,connect) VALUES ";
      for ($i = 0; $i < $nrCats; $i++) {
        $sql .= "(".$cats[$i].",$thisAd)" . ($i + 1 == $nrCats ? "" : ",");
      }
      $sqlResult = mysqli_query($this->con, $sql);
      if(!$sqlResult){
        //Something went wrong...
        $this->ThrowMySqlException($sql);
      }
      $sql = "INSERT INTO tag_advertisement_map (base,connect) VALUES ";
      for ($i = 0; $i < $nrTags; $i++) {
        $sql .= "(".$tags[$i].",$thisAd)" . ($i + 1 == $nrTags ? "" : ",");
      }
      $sqlResult = mysqli_query($this->con, $sql);
      if(!$sqlResult){
        //Something went wrong...
        $this->ThrowMySqlException($sql);
      } 
    }

    $count++;
  }
}

