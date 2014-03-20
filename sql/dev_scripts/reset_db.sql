
DROP DATABASE IF EXISTS coderspool;
CREATE DATABASE coderspool DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;

USE coderspool;

  -------------- Base tables ---------------

CREATE TABLE account (

  username        VARCHAR(32) PRIMARY KEY,
  email           VARCHAR(64) NOT NULL,
  password        VARCHAR(32) NOT NULL,
  user_table      ENUM('user_person','user_company')       

);

CREATE TABLE user_person (

  username        VARCHAR(32) PRIMARY KEY,
  firstname       VARCHAR(32) NOT NULL,
  lastname        VARCHAR(32) NOT NULL,
  personal_id     VARCHAR(16) NOT NULL, -- changed, but will not work until recreated database
  street_address  VARCHAR(64) NOT NULL,
  postal_code     VARCHAR(16) NOT NULL,
  city            VARCHAR(32) NOT NULL,
  company_tax     BIT(1)      NOT NULL,
  company_name    VARCHAR(64),  
  phone           VARCHAR(64),

  FOREIGN KEY (username) REFERENCES account(username)

);

CREATE TABLE user_company (

  username        VARCHAR(32) PRIMARY KEY,
  name            VARCHAR(64) NOT NULL,
  size            INT(11),
  org_nr          VARCHAR(64) NOT NULL,
  street_address  VARCHAR(64) NOT NULL,
  postal_code     VARCHAR(16) NOT NULL,
  city            VARCHAR(32) NOT NULL,
  contact_person  VARCHAR(64) NOT NULL,
  phone           VARCHAR(64),

  FOREIGN KEY (username) REFERENCES account(username)
);

  -------------- User related data ---------------

CREATE TABLE profile_person (

  username        VARCHAR(32) PRIMARY KEY,
  active          BIT(1) NOT NULL DEFAULT b'0',
  visible         BIT(1) NOT NULL DEFAULT b'0',
  content         TEXT,
  snippet         TINYTEXT,
  experience      INT(11),
  cv              VARCHAR(256), -- URL
  image           VARCHAR(256), -- URL

  FOREIGN KEY (username) REFERENCES account(username)

);


CREATE TABLE profile_company (

  username        VARCHAR(32) PRIMARY KEY,
  active          BIT(1) NOT NULL DEFAULT b'0',
  visible         BIT(1) NOT NULL DEFAULT b'0',
  content         TEXT,
  snippet         TINYTEXT,
  experience      INT(11),
  image_logo      VARCHAR(256), -- URL
  image_view      VARCHAR(256), -- URL
  image_contact   VARCHAR(256), -- URL

  FOREIGN KEY (username) REFERENCES account(username)

);

CREATE TABLE advertisement (

  id              INT(11) AUTO_INCREMENT PRIMARY KEY, -- Need different key due to one-to-many relation to username
  username        VARCHAR(32),
  profile         ENUM('profile_person','profile_company'),
  content         TEXT,
  snippet         VARCHAR(256),
  experience      VARCHAR(16),

  FOREIGN KEY (username) REFERENCES account(username)

);

            --------- METADATA ---------

  ----------- TAGS - Storage and mappings -----------

CREATE TABLE tag (

  id              INT(11) AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(64) UNIQUE

);

CREATE TABLE tag_user_map (

  map_id          INT(11) AUTO_INCREMENT PRIMARY KEY,
  base            INT(11),
  connect         VARCHAR(32),

  FOREIGN KEY (base)      REFERENCES tag(id),
  FOREIGN KEY (connect)   REFERENCES account(username)

);


CREATE TABLE tag_advertise_map (

  map_id          INT(11) AUTO_INCREMENT PRIMARY KEY,
  base            INT(11),
  connect         INT(11),
  
  FOREIGN KEY (base)      REFERENCES tag(id),
  FOREIGN KEY (connect)   REFERENCES advertisement(id)

);

  ------- CATEGORIES - Storage and mapping --------

CREATE TABLE category (

  id              INT(11) AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(64) UNIQUE

);

CREATE TABLE category_user_map (
  
  map_id          INT(11) AUTO_INCREMENT PRIMARY KEY,
  base            INT(11),
  connect         VARCHAR(32),

  FOREIGN KEY (base)     REFERENCES category(id),
  FOREIGN KEY (connect)   REFERENCES account(username)

);

CREATE TABLE category_advertise_map (
  
  map_id          INT(11) AUTO_INCREMENT PRIMARY KEY,
  base            INT(11),
  connect         INT(11),
  
  FOREIGN KEY (base)      REFERENCES category(id),
  FOREIGN KEY (connect)   REFERENCES advertisement(id)

);



   ----------- STORED PROCEDURE - Search function ------------

DELIMITER $$

DROP PROCEDURE IF EXISTS search;

CREATE PROCEDURE search
(
  main          VARCHAR(16),
  ptable        VARCHAR(8),
  categories    VARCHAR(768),
  tags          VARCHAR(768),
  inactive      VARCHAR(8),
  company_tax   VARCHAR(8),
  experience    INT(11)
)
BEGIN

  SET @sql_ands := (SELECT IFNULL(CONCAT_WS(" ",IF(inactive='1',NULL,"AND p.active=b'1'"),IF(company_tax='1',"AND u.company_tax=b'1'",NULL),
    IF(experience>0,CONCAT("AND p.experience>=",experience),NULL)),""));
  
  IF main = "profile" THEN

    IF ptable <> "company" THEN    
      SET @sql_main := (SELECT CONCAT_WS(' ',IF(ptable="both","SELECT * FROM(" , "" ),
      "SELECT COUNT(cu.connect)+IFNULL(B.count,0) AS count, p.username AS id,CONCAT(u.firstname,' ',u.lastname) AS name,
      p.active,p.visible,p.content,p.snippet,p.experience,p.cv,p.image, NULL 
      FROM user_person u INNER JOIN category_user_map cu ON cu.connect=u.username INNER JOIN category c ON cu.base=c.id 
      LEFT JOIN (SELECT count(tu.connect) AS count, tu.connect AS username FROM tag_user_map tu INNER JOIN tag t ON tu.base=t.id
      WHERE t.name IN",tags,"GROUP BY username) B ON B.username=u.username INNER JOIN profile_person p ON p.username=u.username 
      WHERE c.name IN",categories,@sql_ands,"GROUP BY u.username",IF(ptable="both","UNION ALL","ORDER BY count DESC")));
    END IF;

    IF ptable <> "person" THEN
      SET @sql_main := (SELECT CONCAT_WS(' ',IF(ptable="both",@sql_main,""),
      "SELECT COUNT(cu.connect)+IFNULL(B.count,0) AS count, p.username AS id,u.name,p.active,p.visible,p.content,
      p.snippet,p.experience,p.image_logo,p.image_view,p.image_contact 
      FROM user_company u INNER JOIN category_user_map cu ON cu.connect=u.username INNER JOIN category c ON cu.base=c.id 
      LEFT JOIN (SELECT count(tu.connect) AS count, tu.connect AS username FROM tag_user_map tu INNER JOIN tag t ON tu.base=t.id
      WHERE t.name IN",tags,"GROUP BY username) B ON B.username=u.username INNER JOIN profile_company p ON p.username=u.username
      WHERE c.name IN",categories,@sql_ands,"GROUP BY u.username",IF(ptable="both",") combined ORDER BY count DESC","ORDER BY count DESC")));
    END IF;

  ELSEIF main = "advertisement" THEN

    IF ptable <> "company" THEN
      SET @sql_main := (SELECT CONCAT_WS(' ',IF(ptable="both","SELECT * FROM(",""),
      "SELECT COUNT(ca.connect)+IFNULL(B.count,0) AS count, ad.*, CONCAT(u.firstname,' ',u.lastname) as name, p.image FROM advertisement ad
      INNER JOIN user_person u ON ad.username = u.username 
      INNER JOIN category_advertise_map ca ON ad.id = ca.connect INNER JOIN category c ON ca.base = c.id
      LEFT JOIN (SELECT COUNT(ta.connect) AS count, ta.connect AS id FROM tag_advertise_map ta INNER JOIN tag t ON ta.base=t.id
      WHERE t.name IN",tags,"GROUP BY id) B ON B.id=ad.id INNER JOIN profile_person p ON p.username=ad.username
      WHERE c.name IN",categories,@sql_ands,"GROUP BY ad.id",IF(ptable="both",") combined ORDER BY count DESC","ORDER BY count DESC")));
    END IF;

    IF ptable <> "person" THEN
      SET @sql_main := (SELECT CONCAT_WS(' ',IF(ptable="both",@sql_main,""),
      "SELECT COUNT(ca.connect)+IFNULL(B.count,0) AS count, ad.*, u.name, p.image_logo as image FROM advertisement ad
      INNER JOIN user_company u ON ad.username = u.username 
      INNER JOIN category_advertise_map ca ON ad.id = ca.connect INNER JOIN category c ON ca.base = c.id
      LEFT JOIN (SELECT COUNT(ta.connect) AS count, ta.connect AS id FROM tag_advertise_map ta INNER JOIN tag t ON ta.base=t.id
      WHERE t.name IN",tags,"GROUP BY id) B ON B.id=ad.id INNER JOIN profile_company p ON p.username=ad.username
      WHERE c.name IN",categories,@sql_ands,"GROUP BY ad.id",IF(ptable="both",") combined ORDER BY count DESC","ORDER BY count DESC")));
    END IF;

  END IF;

  PREPARE stmt FROM @sql_main;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;

END$$

DELIMITER ;


-- QUERY structure profile search
-------------

-- SELECT count(cu.connect)+IFNULL(B.count,0) AS count, u.username AS id 
-- FROM user_person u 
-- INNER JOIN category_user_map cu ON cu.connect=u.username 
-- INNER JOIN category c ON cu.base=c.id 
-- LEFT JOIN
-- (SELECT count(tu.connect) AS count, tu.connect AS username
-- FROM tag_user_map tu
-- INNER JOIN tag t ON tu.base=t.id
-- WHERE t.name IN("Agile") GROUP BY username) B ON B.username = u.username
-- WHERE c.name IN("Webbutveckling","Systemutveckling")  
-- GROUP BY u.username

-- ORDER BY count DESC; 


