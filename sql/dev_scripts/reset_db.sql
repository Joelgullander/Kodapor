
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
  birthdate       VARCHAR(16) NOT NULL, -- changed, but will not work until recreated database
  company_tax     BIT(1)      NOT NULL,
  company_name    VARCHAR(64),  
  phone           VARCHAR(64),

  FOREIGN KEY (username) REFERENCES account(username)

);

CREATE TABLE user_company (

  username        VARCHAR(32) PRIMARY KEY,
  name            VARCHAR(64) NOT NULL,
  contact_person  VARCHAR(64) NOT NULL,
  phone           VARCHAR(64),

  FOREIGN KEY (username) REFERENCES account(username)
);

  -------------- User related data ---------------

CREATE TABLE profile_person (

  id              INT(11) AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(32),
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

  id              INT(11) AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(32),
  active          BIT(1) NOT NULL DEFAULT b'0',
  visible         BIT(1) NOT NULL DEFAULT b'0',
  content         TEXT,
  snippet         TINYTEXT,
  business_years  INT(11),
  size            INT(11),
  image_logo      VARCHAR(256), -- URL
  image_view      VARCHAR(256), -- URL
  image_contact   VARCHAR(256), -- URL

  FOREIGN KEY (username) REFERENCES account(username)

);

CREATE TABLE advertisement (

  id              INT(11) AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(32),
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

CREATE TABLE map_tag_user (

  map_id          INT(11) AUTO_INCREMENT PRIMARY KEY,
  base            INT(11),
  connect         VARCHAR(32),

  FOREIGN KEY (base)      REFERENCES tag(id),
  FOREIGN KEY (connect)   REFERENCES account(username)

);


CREATE TABLE map_tag_advertise (

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

CREATE TABLE map_category_user (
  
  map_id          INT(11) AUTO_INCREMENT PRIMARY KEY,
  base            INT(11),
  connect         VARCHAR(32),

  FOREIGN KEY (base)     REFERENCES category(id),
  FOREIGN KEY (connect)   REFERENCES account(username)

);

CREATE TABLE map_catategory_advertise (
  
  map_id          INT(11) AUTO_INCREMENT PRIMARY KEY,
  base            INT(11),
  connect         INT(11),
  
  FOREIGN KEY (base)      REFERENCES category(id),
  FOREIGN KEY (connect)   REFERENCES advertisement(id)

);


 


