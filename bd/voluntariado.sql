-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 08-12-2025 a las 02:04:49
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `voluntariado`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

DROP TABLE IF EXISTS `asistencia`;
CREATE TABLE IF NOT EXISTS `asistencia` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `evento_id` bigint NOT NULL,
  `estado` enum('CONFIRMADA','NO_ASISTIO') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'NO_ASISTIO',
  `puntos_otorgados` int DEFAULT '0',
  `confirmado_en` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `evento_id` (`evento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asistencia`
--

INSERT INTO `asistencia` (`id`, `usuario_id`, `evento_id`, `estado`, `puntos_otorgados`, `confirmado_en`) VALUES
(2, 12, 7, 'CONFIRMADA', 5, NULL),
(3, 12, 6, 'CONFIRMADA', 2, NULL),
(4, 12, 12, 'CONFIRMADA', 30, NULL),
(5, 12, 1, 'CONFIRMADA', 10, NULL),
(6, 12, 13, 'CONFIRMADA', 50, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canje`
--

DROP TABLE IF EXISTS `canje`;
CREATE TABLE IF NOT EXISTS `canje` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `recompensa_id` bigint NOT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `puntos_usados` int NOT NULL,
  `estado` enum('PENDIENTE','ENTREGADO','CANCELADO') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'PENDIENTE',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `recompensa_id` (`recompensa_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `canje`
--

INSERT INTO `canje` (`id`, `usuario_id`, `recompensa_id`, `fecha`, `puntos_usados`, `estado`) VALUES
(1, 1, 1, '2025-09-10 10:17:45', 50, 'ENTREGADO'),
(2, 12, 3, '2025-11-18 21:41:31', 50, 'ENTREGADO'),
(3, 12, 4, '2025-11-19 14:35:11', 10, 'ENTREGADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

DROP TABLE IF EXISTS `categoria`;
CREATE TABLE IF NOT EXISTS `categoria` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id`, `nombre`, `descripcion`, `creado_en`) VALUES
(1, 'Ambiental', 'Eventos relacionados al medio ambiente', '2025-11-17 21:12:23'),
(2, 'Educación', 'Charlas, talleres y cursos', '2025-11-17 21:12:23'),
(3, 'Salud', 'Campañas y actividades de salud', '2025-11-17 21:12:23'),
(4, 'Animales', 'Eventos de ayuda a animales', '2025-11-17 21:12:23'),
(5, 'Otras', 'Categoría por defecto para otros eventos', '2025-11-17 21:12:23'),
(6, 'Material', 'Recompensas físicas', '2025-11-17 21:12:23'),
(7, 'Digital', 'Recompensas digitales', '2025-11-17 21:12:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `certificado`
--

DROP TABLE IF EXISTS `certificado`;
CREATE TABLE IF NOT EXISTS `certificado` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `evento_id` bigint NOT NULL,
  `url_pdf` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_emision` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `evento_id` (`evento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `certificado`
--

INSERT INTO `certificado` (`id`, `usuario_id`, `evento_id`, `url_pdf`, `fecha_emision`) VALUES
(2, 1, 1, 'pdf', '2025-09-10 10:20:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento`
--

DROP TABLE IF EXISTS `evento`;
CREATE TABLE IF NOT EXISTS `evento` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `lugar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cupo_maximo` int DEFAULT '0',
  `organizador_id` bigint NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `imagen_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `puntos_otorga` int NOT NULL DEFAULT '0',
  `categoria_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `organizador_id` (`organizador_id`),
  KEY `evento_categoria_fk` (`categoria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evento`
--

INSERT INTO `evento` (`id`, `titulo`, `descripcion`, `fecha_inicio`, `fecha_fin`, `lugar`, `cupo_maximo`, `organizador_id`, `creado_en`, `imagen_url`, `puntos_otorga`, `categoria_id`) VALUES
(1, 'Reforestación en Arequipa', 'Plantaremos 100 árboles en la comunidad.', '2025-09-27 06:00:00', '2025-09-27 14:00:00', 'Cochabamba', NULL, 3, '2025-09-10 08:18:00', 'http://localhost:8080/uploads/eventos/ddfdc5ed-d46a-440b-8d6f-eb4eebf9a87a.jpeg', 10, 1),
(6, 'Limpieza de Playas', 'Ayudar a limpiar las playas(residuos, plasticos)', '2025-10-17 15:38:00', '2025-10-20 15:38:00', 'Villa el Salvador', 4, 1, '2025-10-11 17:39:13', 'http://localhost:8080/uploads/eventos/bf8e19f7-6968-4533-97d3-61a8e2956b3d.jpg', 2, 1),
(7, 'Pacas', 'jude', '2025-10-19 14:54:00', '2025-10-25 14:54:00', 'Costa', 1, 1, '2025-10-13 22:54:11', NULL, 5, 3),
(8, 'Limpieza del rio Lurin', 'Limpiar  y recoger los residuos que se encuentre', '2025-11-01 19:36:00', '2025-11-02 19:34:00', 'Rio Lurin', 10, 11, '2025-10-14 23:34:15', 'http://localhost:8080/uploads/eventos/f46f94e4-086f-46a6-9814-1766ad5c17ea.jpeg', 40, 1),
(12, 'Gran Limpieza de Playa Costa Verde', 'Únete a nosotros para una jornada de limpieza en la playa Costa Verde. Ayudaremos a recolectar residuos plásticos y otros desechos para proteger nuestra fauna marina. Nosotros proporcionaremos guantes y bolsas. ¡Trae tu botella de agua reutilizable y muchas ganas de ayudar!', '2025-11-27 16:00:00', '2025-11-27 22:00:00', 'Playa Agua Dulce, Chorrillos, Lima', 50, 1, '2025-11-06 22:43:36', 'http://localhost:8080/uploads/eventos/129eec75-7a99-405c-a76b-c93c392603c3.jpg', 30, 1),
(13, 'CURSO DE ESPECIALIZACIÓN Psicología Aplicada al Vínculo Humano–Animal', 'Requisitos e Indicaciones\nModalidad: Virtual\n\nDuración: 60 horas\n\nCertificación: Certificado de Voluntariado + Diploma\n\nInversión: S/ 120.00 (incluye clases asincrónicas, materiales y certificación)\n\nIdeal para:\n\nVoluntarios de albergues\nPersonas que desean ayudar en rescate y adopciones\nEstudiantes de psicología, educación, trabajo social\nFamilias que deseen mejorar la convivencia con sus mascotas\nOBJETIVO\nComprender y aplicar herramientas psicológicas para fortalecer el vínculo humano–animal y promover bienestar emocional en personas y mascotas.', '2025-11-28 05:12:00', '2025-12-13 05:12:00', 'Virtual', 50, 3, '2025-11-12 23:14:28', 'http://localhost:8080/uploads/eventos/86bf6b95-9097-4fe6-bd5a-a2e5a7ba6359.jpeg', 50, 4),
(14, 'Voluntariado virtual por los animales', '¿Qué buscamos?\nLos voluntarios participan apoyando la difusión de nuestras actividades en redes sociales, elaborando contenido creativo, sumándose a campañas de recaudación y promoviendo la afiliación al programa K-Pito Automático.\n\nComo parte del programa, deberás cumplir los retos de recaudación de fondos, logrando que tus contactos se sumen a la RIFATÓN y al programa de padrinos K-Pito Automático. Tu apoyo permite que más mascotas rescatadas reciban cuidado, alimentación y una segunda oportunidad. \n\n Tareas y Responsabilidades:\nACTIVIDAD 1: Difusión en Redes Sociales\nDescripción:\nPublicación de contenido relacionado con animales rescatados, en adopción, historias de éxito y casos urgentes. También se promoverán campañas, eventos y acciones de recaudación.\nInstrucciones:Se entregará un paquete con 20 piezas gráficas y audiovisuales para su publicación del 10 de noviembre al 14 de diciembre.\nEl voluntario podrá publicar al menos 1 contenido por día, no se puede publicar 2 contenidos por día.\nLas publicaciones pueden ser subidas de forma opcional en Facebook o Instagram.\nEs obligatorio compartirlas en historias de WhatsApp y en chats/grupos de WhatsApp.\nPor cada publicación, deberán tomar una captura de pantalla y subirla a su carpeta de Drive asignada.\nTiempo estimado: 20 horas\n ACTIVIDAD 2: Elaboración de Videos para Redes Sociales\nDescripción:\nCreación de videos interactivos para promocionar las campañas de la Asociación.\nInstrucciones:La Asociación enviará hasta 5 campañas que deberán grabarse en formato vertical, solos o acompañados de mascotas (si tuvieran).\nSe indicarán mensajes y lemas específicos a través del grupo de WhatsApp.\nCada video deberá subirse a la carpeta de Drive asignada.\nPeríodo de entrega: del 10 de noviembre al 14 de diciembre.\nTiempo estimado: 8 horas\n ACTIVIDAD 3: Apoyo en Campañas de Recaudación de Fondos\nDescripción:\nLogra la meta invitando a 6 contactos a sumarse a la RIFATÓN \nInstrucciones:Logra la meta invitando a 6 contactos a sumarse a la RIFATÓN \nCada rifa tiene un costo de S/ 10.\nPeríodo de entrega: del 10 de noviembre al 14 de diciembre.\nTiempo estimado: 6 horas\n ACTIVIDAD 4: Afiliación de Nuevos Miembros al Programa K-Pito Automático*\nDescripción:\nEsta actividad consiste en promover el programa de donación mensual, el cual nos permite brindar alimentación, cuidados y soporte continuo a mascotas rescatadas.\nInstrucciones:Tu objetivo en esta actividad es lograr la meta de invitar a 4 personas al programa K-Pito Automático, eligiendo cualquiera de los siguientes montos mensuales:\nS/ 10, S/ 20, S/ 30 o más, según sus posibilidades.\nPeríodo de entrega: del 10 de noviembre al 14 de diciembre.\nTiempo estimado: 6 horas', '2025-11-12 13:56:00', '2025-12-16 13:56:00', 'Cercado De Lima', 16, 3, '2025-11-17 21:56:50', 'http://localhost:8080/uploads/eventos/35c66209-c259-46ba-af37-7df0f8ffea95.jpeg', 40, 4),
(16, 'Programa de Hogar Temporal KP: Cuida y Adopta', '¿Tienes espacio en tu hogar y en tu corazón para un animalito en recuperación?\n\n¡Únete al Programa de Hogares Temporales KP y conviértete en el puente hacia una nueva vida para una mascota rescatada!\n\nDurante 9 semanas, ofrecerás un hogar lleno de amor y cuidados a perros o gatos que necesitan sanar física y emocionalmente, mientras nosotros trabajamos para encontrarles una familia definitiva.', '2025-12-02 00:52:00', '2026-01-20 00:52:00', 'cercado de lima', 10, 3, '2025-11-19 00:53:51', 'http://localhost:8080/uploads/eventos/704f9f74-e6d6-4611-927d-c0021ad593df.jpg', 50, 4),
(17, 'Voluntariado Navidad (San Juan de Lurigancho)', 'Actividad navideña 21 DE DICIEMBRE ESTAMOS ORGANIZANDO UN SHOW NAVIDENO CON REGALOS, CHOCOLATA Y ACTIVIDADES DIVERTIDAS EN LA CASA HOGAR DE SAN JUAN DE LURIGANCHO.\nRequisitos e Indicaciones\nLa buena voluntad de hacer algo por los demás.\nCompromiso hacia el programa.\nTener tacto, respeto y consideración para poder entablar una relación con los beneficiarios del programa.\nSaber trabajar en equipo.', '2025-12-21 13:00:00', '2025-12-21 15:00:00', 'Av. El Periodista , San Juan de Lurigancho', 6, 3, '2025-11-19 00:56:54', 'http://localhost:8080/uploads/eventos/5dad87ea-7b1b-4850-b9c9-be30e56520b4.webp', 40, 3),
(18, 'Psicólogo en Pamplona Alta', 'Fundada en 2017, Superlearner es una ONG italiana que opera en Lima (Perú) ofreciendo educación informal y apoyo médico a la población local.\n\n\n\nBuscamos un psicólogo que pueda ofrecer consultas en el puesto de salud Desiderio Moscoso Castillo de Pamplona Alta (San Juan de Miraflores, Lima), atendiendo a niños, adolescentes y adultos que viven en contextos de vulnerabilidad. También es posible realizar talleres sobre habilidades blandas, emociones y otros en distintas comunidades de la zona.\n\n\n\nSi están interesados, por favor envíen su CV y carta de presentación a volunteer@superlearnerperu.com. NO SE CONTACTARÁN LOS QUE POSTULAN EN LA PLATAFORMA PROA SIN ENVIAR EL CV.', '2025-11-23 05:00:00', '2026-03-22 16:59:00', 'camino real, San Juan de Miraflores, Lima, Lima', 6, 3, '2025-11-19 01:01:05', 'http://localhost:8080/uploads/eventos/8ca240fc-6483-4352-b370-2c0db40e1c2d.png', 60, 3),
(19, 'Reciclaje', 'Reciclaje de residuos', '2025-11-27 14:33:00', '2026-01-07 14:33:00', 'San Juan', 10, 3, '2025-11-19 14:34:02', 'http://localhost:8080/uploads/eventos/85f3b53d-0164-44e5-bb32-b82319f0ef6f.jpg', 50, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripcion`
--

DROP TABLE IF EXISTS `inscripcion`;
CREATE TABLE IF NOT EXISTS `inscripcion` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `evento_id` bigint NOT NULL,
  `estado` enum('PENDIENTE','ACEPTADA','RECHAZADA') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'PENDIENTE',
  `solicitado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`evento_id`),
  KEY `evento_id` (`evento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripcion`
--

INSERT INTO `inscripcion` (`id`, `usuario_id`, `evento_id`, `estado`, `solicitado_en`) VALUES
(2, 12, 13, 'ACEPTADA', '2025-11-13 00:19:19'),
(3, 12, 12, 'ACEPTADA', '2025-11-13 21:34:06'),
(4, 12, 1, 'RECHAZADA', '2025-11-13 21:35:15'),
(6, 12, 6, 'PENDIENTE', '2025-11-18 00:16:49'),
(7, 12, 7, 'ACEPTADA', '2025-12-03 23:11:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recompensa`
--

DROP TABLE IF EXISTS `recompensa`;
CREATE TABLE IF NOT EXISTS `recompensa` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `costo_puntos` int NOT NULL,
  `stock` int DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `imagen_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `categoria_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `recompensa_categoria_fk` (`categoria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recompensa`
--

INSERT INTO `recompensa` (`id`, `nombre`, `descripcion`, `costo_puntos`, `stock`, `creado_en`, `imagen_url`, `categoria_id`) VALUES
(1, 'Camiseta Voluntario Actualizada', 'Camiseta oficial del voluntariado - edición 2025', 60, 20, '2025-09-10 09:29:49', 'http://localhost:8080/uploads/recompensas/b7a00867-ac3d-4543-9d74-e217164facc0.jpeg', NULL),
(3, 'Balon De Futbol', 'Balon de Futbol autografiado por Hector', 50, 2, '2025-10-06 23:20:46', 'http://localhost:8080/uploads/recompensas/ede0267d-d8b7-4462-91ba-e6c9afae4b07.jpeg', NULL),
(4, 'Entrada Cine', 'Gante entradas para ver una peliula en estreno', 10, 2, '2025-10-14 23:23:54', 'http://localhost:8080/uploads/recompensas/0f93a1c1-19c9-4624-83b2-5ef2e29cd0c7.jpg', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

DROP TABLE IF EXISTS `rol`;
CREATE TABLE IF NOT EXISTS `rol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `nombre`) VALUES
(1, 'ADMIN'),
(2, 'ORGANIZADOR'),
(3, 'VOLUNTARIO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `puntos` int DEFAULT '0',
  `horas_acumuladas` double NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rol_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  KEY `rol_id` (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `correo`, `password`, `telefono`, `puntos`, `horas_acumuladas`, `creado_en`, `rol_id`) VALUES
(1, 'Administrador', 'admin@test.com', '123456', '999999999', 1, 1, '2025-09-10 06:59:58', 1),
(3, 'Pedro Ramírez', 'pedro@example.com', '123456', '984512754', 0, 1, '2025-09-10 07:28:59', 2),
(11, 'Adrian', 'Arce', '123', '234123123', 11, 2, '2025-09-10 15:00:53', 1),
(12, 'Hector', 'reyes@gmail.com', 'somosdina', '997256008', 142, 0, '2025-11-04 21:47:39', 3),
(13, 'Pao', 'colonio@gmail.com', 'Paola20?', '951247852', 0, 0, '2025-11-13 20:58:36', 3);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `evento` (`id`);

--
-- Filtros para la tabla `canje`
--
ALTER TABLE `canje`
  ADD CONSTRAINT `canje_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `canje_ibfk_2` FOREIGN KEY (`recompensa_id`) REFERENCES `recompensa` (`id`);

--
-- Filtros para la tabla `certificado`
--
ALTER TABLE `certificado`
  ADD CONSTRAINT `certificado_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `certificado_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `evento` (`id`);

--
-- Filtros para la tabla `evento`
--
ALTER TABLE `evento`
  ADD CONSTRAINT `evento_categoria_fk` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`),
  ADD CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`organizador_id`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `inscripcion`
--
ALTER TABLE `inscripcion`
  ADD CONSTRAINT `inscripcion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `inscripcion_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `evento` (`id`);

--
-- Filtros para la tabla `recompensa`
--
ALTER TABLE `recompensa`
  ADD CONSTRAINT `recompensa_categoria_fk` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
