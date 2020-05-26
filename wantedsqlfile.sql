
--
-- Table structure for table `knex_migrations`
--
DROP TABLE IF EXISTS `knex_migrations`;
CREATE TABLE `knex_migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
--
-- Dumping data for table `knex_migrations`
--

LOCK TABLES `knex_migrations` WRITE;
INSERT INTO `knex_migrations` VALUES (1,'20200520190251_sbr_users.js',1,'2020-05-25 10:53:54'),(2,'20200520191616_sbr_groups.js',1,'2020-05-25 10:53:54'),(3,'20200520191750_sbr_groups_sub.js',1,'2020-05-25 10:53:54'),(4,'20200520192352_sbr_qnr.js',1,'2020-05-25 10:53:54'),(5,'20200520192416_sbr_groups_sub_qn_models.js',1,'2020-05-25 10:53:54'),(6,'20200520192441_sbr_groups_sub_qn.js',1,'2020-05-25 10:53:54'),(7,'20200520193123_sbr_groups_sub_qn_qnr.js',1,'2020-05-25 10:53:54'),(8,'20200522231200_sbr_groups_sub_qn_answers.js',1,'2020-05-25 10:53:55');
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
CREATE TABLE `knex_migrations_lock` (
  `index` int unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB;

--
-- Dumping data for table `knex_migrations_lock`
--

LOCK TABLES `knex_migrations_lock` WRITE;
INSERT INTO `knex_migrations_lock` VALUES (1,0);
UNLOCK TABLES;

--
-- Table structure for table `sbr_groups`
--

DROP TABLE IF EXISTS `sbr_groups`;
CREATE TABLE `sbr_groups` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Dumping data for table `sbr_groups`
--

LOCK TABLES `sbr_groups` WRITE;
INSERT INTO `sbr_groups` VALUES (1,'COMPRAS','2020-05-25 11:02:05','2020-05-25 11:02:05','2020-05-25 15:41:26'),(2,'PRODUÇÃO','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(3,'PRECIFICAÇÃO','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(4,'ESTOCAGEM','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(5,'WMS','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(6,'VENDAS','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(7,'PRESTAÇÃO DE SERVIÇOS','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(8,'DISTRIBUIÇÃO','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(9,'PAGAMENTOS','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(10,'RECEBIMENTOS','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(11,'GESTÃO FINANCEIRA','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(12,'GESTÃO ESTRATÉGICA','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(13,'GESTÃO DE PESSOAS','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(14,'FISCAL E CONTÁBIL','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL),(15,'CONTROLE PATRIMONIAL','2020-05-25 11:02:05','2020-05-25 11:02:05',NULL);
UNLOCK TABLES;

--
-- Table structure for table `sbr_groups_sub`
--

DROP TABLE IF EXISTS `sbr_groups_sub`;
CREATE TABLE `sbr_groups_sub` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_sbr_groups` int unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)) ENGINE=InnoDB;

--
-- Dumping data for table `sbr_groups_sub`
--

LOCK TABLES `sbr_groups_sub` WRITE;
INSERT INTO `sbr_groups_sub` VALUES (1,1,'Realização de Compras','2020-05-25 12:33:57','2020-05-25 12:33:57','2020-05-25 15:41:26'),(2,15,'jhhghg','2020-05-25 16:02:44','2020-05-25 16:02:44',NULL);
UNLOCK TABLES;

--
-- Table structure for table `sbr_groups_sub_qn`
--

DROP TABLE IF EXISTS `sbr_groups_sub_qn`;
CREATE TABLE `sbr_groups_sub_qn` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_sbr_groups` int unsigned DEFAULT NULL,
  `id_sbr_groups_sub` int unsigned NOT NULL,
  `question` text NOT NULL,
  `type` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)) ENGINE=InnoDB;

--
-- Dumping data for table `sbr_groups_sub_qn`
--

LOCK TABLES `sbr_groups_sub_qn` WRITE;
INSERT INTO `sbr_groups_sub_qn` VALUES (1,1,1,'gfyufyf','2','1',NULL,'2020-05-25 13:03:25','2020-05-25 13:03:25','2020-05-25 15:41:26'),(2,1,1,'teste2','2','1',NULL,'2020-05-25 13:18:49','2020-05-25 13:18:49','2020-05-25 15:41:26'),(3,15,2,'hghjgh','2','1',NULL,'2020-05-25 16:02:52','2020-05-25 16:02:52',NULL);
UNLOCK TABLES;

--
-- Table structure for table `sbr_groups_sub_qn_answers`
--

DROP TABLE IF EXISTS `sbr_groups_sub_qn_answers`;
CREATE TABLE `sbr_groups_sub_qn_answers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_sbr_groups_sub_qn` int unsigned NOT NULL,
  `id_sbr_qnr` int unsigned NOT NULL,
  `id_sbr_groups_sub_qn_models` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)) ENGINE=InnoDB;

--
-- Dumping data for table `sbr_groups_sub_qn_answers`
--

LOCK TABLES `sbr_groups_sub_qn_answers` WRITE;
INSERT INTO `sbr_groups_sub_qn_answers` VALUES (1,1,1,0,'2020-05-25 13:05:07','2020-05-25 13:05:07',NULL),(2,3,3,5,'2020-05-25 16:03:48','2020-05-25 16:03:48',NULL);
UNLOCK TABLES;

--
-- Table structure for table `sbr_groups_sub_qn_models`
--

DROP TABLE IF EXISTS `sbr_groups_sub_qn_models`;
CREATE TABLE `sbr_groups_sub_qn_models` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `agroup` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Dumping data for table `sbr_groups_sub_qn_models`
--

LOCK TABLES `sbr_groups_sub_qn_models` WRITE;
INSERT INTO `sbr_groups_sub_qn_models` VALUES (1,'2','Sim, em sistema integrado','5','1','2020-05-25 13:02:37','2020-05-25 13:02:37',NULL),(2,'2','Sim, independente','3','1','2020-05-25 13:02:37','2020-05-25 13:02:37',NULL),(3,'2','Sim, manual','1','1','2020-05-25 13:02:37','2020-05-25 13:02:37',NULL),(4,'2','Não','0','1','2020-05-25 13:02:37','2020-05-25 13:02:37',NULL),(5,'2','Não se aplica','0','1','2020-05-25 13:02:37','2020-05-25 13:02:37',NULL);
UNLOCK TABLES;

--
-- Table structure for table `sbr_groups_sub_qn_qnr`
--

DROP TABLE IF EXISTS `sbr_groups_sub_qn_qnr`;
CREATE TABLE `sbr_groups_sub_qn_qnr` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_sbr_groups_sub` int unsigned NOT NULL,
  `id_sbr_qnr` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)) ENGINE=InnoDB;

--
-- Dumping data for table `sbr_groups_sub_qn_qnr`
--

LOCK TABLES `sbr_groups_sub_qn_qnr` WRITE;
INSERT INTO `sbr_groups_sub_qn_qnr` VALUES (1,1,1,'2020-05-25 13:03:34','2020-05-25 13:03:34',NULL),(2,1,2,'2020-05-25 13:05:58','2020-05-25 13:05:58',NULL),(3,2,3,'2020-05-25 16:03:19','2020-05-25 16:03:19',NULL),(4,1,4,'2020-05-25 16:08:23','2020-05-25 16:08:23',NULL),(5,2,4,'2020-05-25 16:08:23','2020-05-25 16:08:23',NULL);
UNLOCK TABLES;

--
-- Table structure for table `sbr_qnr`
--

DROP TABLE IF EXISTS `sbr_qnr`;
CREATE TABLE `sbr_qnr` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_sbr_users` int unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)) ENGINE=InnoDB;

--
-- Dumping data for table `sbr_qnr`
--

LOCK TABLES `sbr_qnr` WRITE;
INSERT INTO `sbr_qnr` VALUES (1,1,'Comercial',3,'2020-05-25 13:03:34','2020-05-25 13:03:34',NULL),(2,1,'jjhbjhjh',1,'2020-05-25 13:05:58','2020-05-25 13:05:58',NULL),(3,1,'teste',2,'2020-05-25 16:03:19','2020-05-25 16:03:19',NULL),(4,1,'Realização de Compra',1,'2020-05-25 16:08:23','2020-05-25 16:08:23',NULL);
UNLOCK TABLES;

--
-- Table structure for table `sbr_users`
--

DROP TABLE IF EXISTS `sbr_users`;
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
) ENGINE=InnoDB;
--
-- Dumping data for table `sbr_users`
--
LOCK TABLES `sbr_users` WRITE;
INSERT INTO `sbr_users` VALUES (1,'Giovanni','giovannifc','giovanni@smartbr.com','9112013',5,'2020-05-25 11:02:50','2020-05-25 11:02:50',NULL),(2,'Teste','teste1','teste@teste.com','12345678',0,'2020-05-25 11:37:59','2020-05-25 11:37:59',NULL);
UNLOCK TABLES;
