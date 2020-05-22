-- MySQL dump 10.13  Distrib 8.0.20, for Linux (x86_64)
--
-- Host: localhost    Database: site
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `knex_migrations`
--

DROP TABLE IF EXISTS `knex_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations`
--

LOCK TABLES `knex_migrations` WRITE;
/*!40000 ALTER TABLE `knex_migrations` DISABLE KEYS */;
INSERT INTO `knex_migrations` VALUES (1,'20200520190251_sbr_users.js',1,'2020-05-22 10:57:16'),(2,'20200520191616_sbr_groups.js',1,'2020-05-22 10:57:16'),(3,'20200520191750_sbr_groups_sub.js',1,'2020-05-22 10:57:16'),(4,'20200520192352_sbr_qnr.js',1,'2020-05-22 10:57:16'),(5,'20200520192416_sbr_groups_sub_qn_models.js',1,'2020-05-22 10:57:16'),(6,'20200520192441_sbr_groups_sub_qn.js',1,'2020-05-22 10:57:16'),(7,'20200520193123_sbr_groups_sub_qn_qnr.js',1,'2020-05-22 10:57:16');
/*!40000 ALTER TABLE `knex_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations_lock` (
  `index` int unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations_lock`
--

LOCK TABLES `knex_migrations_lock` WRITE;
/*!40000 ALTER TABLE `knex_migrations_lock` DISABLE KEYS */;
INSERT INTO `knex_migrations_lock` VALUES (1,0);
/*!40000 ALTER TABLE `knex_migrations_lock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbr_groups`
--

DROP TABLE IF EXISTS `sbr_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sbr_groups` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbr_groups`
--

LOCK TABLES `sbr_groups` WRITE;
/*!40000 ALTER TABLE `sbr_groups` DISABLE KEYS */;
INSERT INTO `sbr_groups` VALUES (1,'COMPRAS','2020-05-22 15:54:22','2020-05-22 15:54:22',NULL),(2,'PRODUÇÃO','2020-05-22 18:42:45','2020-05-22 18:42:45',NULL),(3,'PRECIFICAÇÃO','2020-05-22 18:48:25','2020-05-22 18:48:25',NULL);
/*!40000 ALTER TABLE `sbr_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbr_groups_sub`
--

DROP TABLE IF EXISTS `sbr_groups_sub`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sbr_groups_sub` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_sbr_groups` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbr_groups_sub`
--

LOCK TABLES `sbr_groups_sub` WRITE;
/*!40000 ALTER TABLE `sbr_groups_sub` DISABLE KEYS */;
INSERT INTO `sbr_groups_sub` VALUES (1,1,'Análise da necessidade de compras','2020-05-22 15:54:36','2020-05-22 15:54:36',NULL),(2,2,'Planejamento e alinhamento das expectativas de produção','2020-05-22 18:42:56','2020-05-22 18:42:56',NULL),(3,2,'Controle de produção','2020-05-22 18:43:37','2020-05-22 18:43:37',NULL),(4,3,'Apuração de custos','2020-05-22 18:48:34','2020-05-22 18:48:34',NULL);
/*!40000 ALTER TABLE `sbr_groups_sub` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbr_groups_sub_qn`
--

DROP TABLE IF EXISTS `sbr_groups_sub_qn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sbr_groups_sub_qn` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_sbr_groups_sub` int NOT NULL,
  `question` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbr_groups_sub_qn`
--

LOCK TABLES `sbr_groups_sub_qn` WRITE;
/*!40000 ALTER TABLE `sbr_groups_sub_qn` DISABLE KEYS */;
INSERT INTO `sbr_groups_sub_qn` VALUES (1,1,'Compra em função de estoque mínimo e estoque máximo?','2','1',NULL,'2020-05-22 18:33:00','2020-05-22 18:33:00',NULL),(2,1,'Compra em função das vendas realizadas em períodos anteriores (giro) considerando a classificação ABC?','2','1',NULL,'2020-05-22 18:34:32','2020-05-22 18:34:32',NULL),(3,2,'Conhece a capacidade instalada da produção?','2','1',NULL,'2020-05-22 18:43:11','2020-05-22 18:43:11',NULL),(4,2,'Conhece a capacidade ociosa da produção?','2','1',NULL,'2020-05-22 18:43:23','2020-05-22 18:43:23',NULL),(5,3,'Controla lista de materiais - B.O.M de cada etapa de produção?','2','1',NULL,'2020-05-22 18:43:50','2020-05-22 18:43:50',NULL),(6,3,'Antes de produzir, verifica a disponibilidade dos insumos necessários?','2','1',NULL,'2020-05-22 18:44:01','2020-05-22 18:44:01',NULL),(7,4,'Apura os custos dos produtos e serviços, considerando descontos, tributos e frete (custo contábil)?','2','1',NULL,'2020-05-22 18:48:46','2020-05-22 18:48:46',NULL),(8,4,'Apura os gastos fixos e gastos variáveis?','2','1',NULL,'2020-05-22 18:48:55','2020-05-22 18:48:55',NULL);
/*!40000 ALTER TABLE `sbr_groups_sub_qn` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbr_groups_sub_qn_models`
--

DROP TABLE IF EXISTS `sbr_groups_sub_qn_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sbr_groups_sub_qn_models` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `agroup` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbr_groups_sub_qn_models`
--

LOCK TABLES `sbr_groups_sub_qn_models` WRITE;
/*!40000 ALTER TABLE `sbr_groups_sub_qn_models` DISABLE KEYS */;
INSERT INTO `sbr_groups_sub_qn_models` VALUES (1,'2','Sim, em sistema integrado','5',1,'2020-05-22 16:42:21','2020-05-22 16:42:21',NULL),(2,'2','Sim, independente','3',1,'2020-05-22 16:44:39','2020-05-22 16:44:39',NULL),(3,'2','Sim, manual','1',1,'2020-05-22 16:44:39','2020-05-22 16:44:39',NULL),(4,'2','Não','0',1,'2020-05-22 16:44:39','2020-05-22 16:44:39',NULL),(5,'2','Não se aplica','0',1,'2020-05-22 16:44:39','2020-05-22 16:44:39',NULL),(6,'2','Yes','3',2,'2020-05-22 16:45:12','2020-05-22 16:45:12',NULL),(7,'2','No','1',2,'2020-05-22 16:45:12','2020-05-22 16:45:12',NULL),(8,'2','Maybe','0',2,'2020-05-22 16:45:12','2020-05-22 16:45:12',NULL);
/*!40000 ALTER TABLE `sbr_groups_sub_qn_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbr_groups_sub_qn_qnr`
--

DROP TABLE IF EXISTS `sbr_groups_sub_qn_qnr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sbr_groups_sub_qn_qnr` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_sbr_groups` varchar(255) DEFAULT NULL,
  `id_sbr_groups_sub` varchar(255) DEFAULT NULL,
  `id_sbr_qnr` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbr_groups_sub_qn_qnr`
--

LOCK TABLES `sbr_groups_sub_qn_qnr` WRITE;
/*!40000 ALTER TABLE `sbr_groups_sub_qn_qnr` DISABLE KEYS */;
INSERT INTO `sbr_groups_sub_qn_qnr` VALUES (1,'1','2',1,'2020-05-22 20:46:00','2020-05-22 20:46:00',NULL),(2,'3',NULL,1,'2020-05-22 20:46:00','2020-05-22 20:46:00',NULL);
/*!40000 ALTER TABLE `sbr_groups_sub_qn_qnr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbr_qnr`
--

DROP TABLE IF EXISTS `sbr_qnr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sbr_qnr` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_sbr_users` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbr_qnr`
--

LOCK TABLES `sbr_qnr` WRITE;
/*!40000 ALTER TABLE `sbr_qnr` DISABLE KEYS */;
INSERT INTO `sbr_qnr` VALUES (1,'1','Universo',1,'2020-05-22 20:46:00','2020-05-22 20:46:00',NULL);
/*!40000 ALTER TABLE `sbr_qnr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbr_users`
--

DROP TABLE IF EXISTS `sbr_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sbr_users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sbr_users_username_unique` (`username`),
  UNIQUE KEY `sbr_users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbr_users`
--

LOCK TABLES `sbr_users` WRITE;
/*!40000 ALTER TABLE `sbr_users` DISABLE KEYS */;
INSERT INTO `sbr_users` VALUES (1,'Giovanni','giovannifc','giovanni@smartbr.com','09112013',5,'2020-05-22 10:57:50','2020-05-22 10:57:50',NULL);
/*!40000 ALTER TABLE `sbr_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-22 18:04:44
