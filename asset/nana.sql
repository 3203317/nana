/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 50511
Source Host           : localhost:3306
Source Database       : nana

Target Server Type    : MYSQL
Target Server Version : 50511
File Encoding         : 65001

Date: 2014-03-25 22:00:37
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `s_device`
-- ----------------------------
DROP TABLE IF EXISTS `s_device`;
CREATE TABLE `s_device` (
  `Id` varchar(32) NOT NULL DEFAULT '',
  `User_Id` varchar(32) DEFAULT NULL,
  `DeviceName` varchar(100) DEFAULT NULL,
  `DeviceType` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of s_device
-- ----------------------------

-- ----------------------------
-- Table structure for `s_device_log`
-- ----------------------------
DROP TABLE IF EXISTS `s_device_log`;
CREATE TABLE `s_device_log` (
  `Id` varchar(32) NOT NULL DEFAULT '',
  `Device_Id` varchar(32) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `Longitude` varchar(100) DEFAULT NULL,
  `Latitude` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of s_device_log
-- ----------------------------

-- ----------------------------
-- Table structure for `s_user`
-- ----------------------------
DROP TABLE IF EXISTS `s_user`;
CREATE TABLE `s_user` (
  `Id` varchar(32) NOT NULL DEFAULT '',
  `UserName` varchar(32) DEFAULT NULL,
  `Password` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of s_user
-- ----------------------------
