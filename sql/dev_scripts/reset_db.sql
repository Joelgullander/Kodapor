
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


 


