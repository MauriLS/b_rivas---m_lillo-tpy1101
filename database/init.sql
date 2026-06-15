-- Script de creación de base de datos
-- Proyecto: Sistema Mantenedor de Usuarios
-- Base de datos: PostgreSQL

-- Crear base de datos (ejecutar como superusuario si no existe)
-- CREATE DATABASE usuarios_db;

-- Conectar a la base de datos antes de ejecutar el resto
-- \c usuarios_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id       BIGSERIAL PRIMARY KEY,
    username VARCHAR(50)  NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name     VARCHAR(100) NOT NULL,
    email    VARCHAR(100),
    role     VARCHAR(20)  NOT NULL DEFAULT 'USER',
    active   BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Datos iniciales (contraseñas encriptadas con BCrypt)
-- Contraseña real: admin123
INSERT INTO users (username, password, name, email, role, active) VALUES
('admin',           '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador',  'admin@ejemplo.com',           'ADMIN', TRUE),
-- Contraseña real: pass123
('juan.perez',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Juan Pérez',     'juan.perez@ejemplo.com',      'USER',  TRUE),
('maria.gonzalez',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'María González', 'maria.gonzalez@ejemplo.com',  'USER',  TRUE)
ON CONFLICT (username) DO NOTHING;
