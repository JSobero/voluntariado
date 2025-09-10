
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS voluntariado_db;
USE voluntariado_db;

-- Tabla Roles
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla Usuarios
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    puntos INT DEFAULT 0,
    rol_id BIGINT,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Tabla Eventos
CREATE TABLE eventos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    lugar VARCHAR(150),
    cupo INT,
    estado VARCHAR(20) DEFAULT 'Activo',
    organizador_id BIGINT,
    FOREIGN KEY (organizador_id) REFERENCES usuarios(id)
);

-- Tabla Inscripciones
CREATE TABLE inscripciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    evento_id BIGINT,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
);

-- Tabla Asistencias
CREATE TABLE asistencias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    evento_id BIGINT,
    estado VARCHAR(20) DEFAULT 'No asistió',
    puntos_otorgados INT DEFAULT 0,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
);

-- Tabla Recompensas
CREATE TABLE recompensas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    costo_puntos INT NOT NULL,
    stock INT DEFAULT 0
);

-- Tabla Canjes
CREATE TABLE canjes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    recompensa_id BIGINT,
    puntos_usados INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (recompensa_id) REFERENCES recompensas(id)
);

-- Tabla Certificados
CREATE TABLE certificados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    evento_id BIGINT,
    url_pdf VARCHAR(255),
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
);

-- INSERTS de ejemplo
INSERT INTO roles (nombre) VALUES ('ADMIN'), ('ORGANIZADOR'), ('VOLUNTARIO');

INSERT INTO usuarios (nombre, correo, password, puntos, rol_id) VALUES
('Admin Principal', 'admin@voluntariado.com', 'admin123', 0, 1),
('Carlos Pérez', 'carlos@voluntariado.com', 'org123', 0, 2),
('Ana Gómez', 'ana@voluntariado.com', 'vol123', 50, 3),
('Luis Torres', 'luis@voluntariado.com', 'vol123', 30, 3);

INSERT INTO eventos (titulo, descripcion, fecha_inicio, fecha_fin, lugar, cupo, estado, organizador_id) VALUES
('Limpieza de Playa', 'Jornada de limpieza en la playa principal.', '2025-09-15 09:00:00', '2025-09-15 13:00:00', 'Playa Central', 50, 'Activo', 2),
('Reforestación Urbana', 'Plantación de árboles en la ciudad.', '2025-10-01 08:00:00', '2025-10-01 12:00:00', 'Parque Metropolitano', 30, 'Activo', 2);

INSERT INTO inscripciones (usuario_id, evento_id, estado) VALUES
(3, 1, 'Aceptada'),
(4, 1, 'Pendiente');

INSERT INTO asistencias (usuario_id, evento_id, estado, puntos_otorgados) VALUES
(3, 1, 'Confirmada', 20);

INSERT INTO recompensas (nombre, descripcion, costo_puntos, stock) VALUES
('Camiseta Voluntario', 'Camiseta oficial del programa de voluntariado.', 30, 10),
('Botella Reutilizable', 'Botella de acero inoxidable con logo.', 20, 15);

INSERT INTO canjes (usuario_id, recompensa_id, puntos_usados, estado) VALUES
(3, 1, 30, 'Entregado');

INSERT INTO certificados (usuario_id, evento_id, url_pdf) VALUES
(3, 1, 'http://voluntariado.com/certificados/ana_gomez_evento1.pdf');
use voluntariado_db;
select * from asistencias;