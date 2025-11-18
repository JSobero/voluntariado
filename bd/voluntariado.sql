-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: voluntariado
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asistencia`
--

DROP TABLE IF EXISTS `asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencia` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) NOT NULL,
  `evento_id` bigint(20) NOT NULL,
  `estado` enum('CONFIRMADA','NO_ASISTIO') DEFAULT 'NO_ASISTIO',
  `puntos_otorgados` int(11) DEFAULT 0,
  `confirmado_en` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `evento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencia`
--

LOCK TABLES `asistencia` WRITE;
/*!40000 ALTER TABLE `asistencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canje`
--

DROP TABLE IF EXISTS `canje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canje` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) NOT NULL,
  `recompensa_id` bigint(20) NOT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp(),
  `puntos_usados` int(11) NOT NULL,
  `estado` enum('PENDIENTE','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `recompensa_id` (`recompensa_id`),
  CONSTRAINT `canje_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `canje_ibfk_2` FOREIGN KEY (`recompensa_id`) REFERENCES `recompensa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canje`
--

LOCK TABLES `canje` WRITE;
/*!40000 ALTER TABLE `canje` DISABLE KEYS */;
INSERT INTO `canje` VALUES (1,1,1,'2025-09-10 10:17:45',50,'ENTREGADO');
/*!40000 ALTER TABLE `canje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Ambiental','Eventos relacionados al medio ambiente','2025-11-16 04:12:18'),(2,'Educación','Charlas, talleres y cursos','2025-11-16 04:12:18'),(3,'Salud','Campañas y actividades de salud','2025-11-16 04:12:18'),(4,'Material','Recompensas físicas','2025-11-16 04:12:18'),(5,'Digital','Recompensas digitales','2025-11-16 04:12:18');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificado`
--

DROP TABLE IF EXISTS `certificado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificado` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) NOT NULL,
  `evento_id` bigint(20) NOT NULL,
  `url_pdf` varchar(500) DEFAULT NULL,
  `fecha_emision` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `certificado_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `certificado_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `evento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificado`
--

LOCK TABLES `certificado` WRITE;
/*!40000 ALTER TABLE `certificado` DISABLE KEYS */;
INSERT INTO `certificado` VALUES (2,1,1,'pdf','2025-09-10 10:20:20');
/*!40000 ALTER TABLE `certificado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `lugar` varchar(255) DEFAULT NULL,
  `cupo_maximo` int(11) DEFAULT 0,
  `organizador_id` bigint(20) NOT NULL,
  `creado_en` timestamp NULL DEFAULT current_timestamp(),
  `imagen_url` varchar(255) DEFAULT NULL,
  `puntos_otorga` int(11) NOT NULL DEFAULT 0,
  `categoria_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `organizador_id` (`organizador_id`),
  KEY `evento_categoria_fk` (`categoria_id`),
  CONSTRAINT `evento_categoria_fk` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`),
  CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`organizador_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
INSERT INTO `evento` VALUES (1,'Reforestación en Arequipa','Plantaremos 100 árboles en la comunidad.','2025-09-20 14:00:00','2025-09-20 22:00:00','Ccollpapampa',30,1,'2025-09-10 08:18:00','gr',0,NULL);
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripcion`
--

DROP TABLE IF EXISTS `inscripcion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripcion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) NOT NULL,
  `evento_id` bigint(20) NOT NULL,
  `estado` enum('PENDIENTE','ACEPTADA','RECHAZADA') DEFAULT 'PENDIENTE',
  `solicitado_en` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`evento_id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `inscripcion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `inscripcion_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `evento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripcion`
--

LOCK TABLES `inscripcion` WRITE;
/*!40000 ALTER TABLE `inscripcion` DISABLE KEYS */;
/*!40000 ALTER TABLE `inscripcion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recompensa`
--

DROP TABLE IF EXISTS `recompensa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recompensa` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `costo_puntos` int(11) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `creado_en` timestamp NULL DEFAULT current_timestamp(),
  `imagen_url` varchar(500) DEFAULT NULL,
  `categoria_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `recompensa_categoria_fk` (`categoria_id`),
  CONSTRAINT `recompensa_categoria_fk` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recompensa`
--

LOCK TABLES `recompensa` WRITE;
/*!40000 ALTER TABLE `recompensa` DISABLE KEYS */;
INSERT INTO `recompensa` VALUES (1,'Camiseta Voluntario Actualizada','Camiseta oficial del voluntariado - edición 2025',60,15,'2025-09-10 09:29:49',NULL,NULL);
/*!40000 ALTER TABLE `recompensa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'ADMIN'),(2,'ORGANIZADOR'),(3,'VOLUNTARIO');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `puntos` int(11) DEFAULT 0,
  `horas_acumuladas` decimal(6,2) DEFAULT 0.00,
  `creado_en` timestamp NULL DEFAULT current_timestamp(),
  `rol_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Administrador','admin@test.com','123456','999999999',NULL,NULL,'2025-09-10 06:59:58',1),(3,'Pedro Ramírez','pedro@example.com','123456',NULL,0,0.00,'2025-09-10 07:28:59',2);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-16  0:42:25
