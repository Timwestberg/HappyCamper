
DROP DATABASE IF EXISTS happyCamper;
CREATE DATABASE happyCamper;

USE happyCamper;

CREATE TABLE `stateSearches` (
  `id` Int( 11 ) AUTO_INCREMENT NOT NULL,
  `stateCode` VARCHAR( 2 ) NOT NULL,
	'hits' Int ( 11 ),
   PRIMARY KEY ( `id` )
);

CREATE TABLE `parkSearches` (
  `id` Int( 11 ) AUTO_INCREMENT NOT NULL,
  `parkCode` VARCHAR( 2 ) NOT NULL,
	'hits' Int ( 11 ),
   PRIMARY KEY ( `id` )
);

INSERT INTO stateSearches(stateCode) values('CA');
INSERT INTO parkSearches(parkCode) values('YOSE');
INSERT INTO parkSearches(parkCode) values('YELL');
