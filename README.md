# Sistema Mantenedor de Usuarios

Aplicación web Full Stack para la administración de usuarios con autenticación y operaciones CRUD.

**Integrantes:** Brunno Rivas — M. Lillo

---

## Arquitectura

| Capa | Tecnología | Puerto |
|---|---|---|
| Frontend | React + Vite | 5173 |
| Backend | Spring Boot 4 | 8080 |
| Base de datos | PostgreSQL | 5432 (estándar) |

---

## Requisitos previos

- Java 17+
- Node.js 18+
- PostgreSQL 14+

---

## Configuración de la base de datos

### 1. Crear la base de datos y el usuario

Conectarse a PostgreSQL como superusuario y ejecutar:

```sql
CREATE DATABASE usuarios_db;
CREATE USER chatbot WITH PASSWORD 'dev';
GRANT ALL PRIVILEGES ON DATABASE usuarios_db TO chatbot;
```

> Las tablas se crean automáticamente al levantar el backend (`ddl-auto=update`).
> Los usuarios de prueba también se insertan solos al primer arranque.

### 2. (Opcional) Crear las tablas manualmente

Si prefieres ejecutar el script SQL directamente:

```bash
psql -U chatbot -d usuarios_db -f database/init.sql
```

O abrir `database/init.sql` en pgAdmin y ejecutarlo sobre `usuarios_db`.

---

## Ejecución del backend

```bash
cd backend
./mvnw spring-boot:run
```

El servidor queda disponible en `http://localhost:8080`.

### Variables de entorno (opcional)

Copia `backend/.env.example` como `backend/.env` y ajusta los valores si tu PostgreSQL usa credenciales distintas:

```env
DB_URL=jdbc:postgresql://localhost:5432/usuarios_db
DB_USERNAME=chatbot
DB_PASSWORD=dev
DDL_AUTO=update
PORT=8080
```

> Si no creas el `.env`, el backend usa los valores por defecto del `application.properties`.

---

## Ejecución del frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## Credenciales de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | ADMIN |
| `juan.perez` | `pass123` | USER |
| `maria.gonzalez` | `pass123` | USER |

---

## Endpoints del backend

| Método | URL | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/users` | Listar usuarios |
| POST | `/api/users` | Crear usuario |
| PUT | `/api/users/{id}` | Actualizar usuario |
| DELETE | `/api/users/{id}` | Eliminar usuario |

---

## Dependencias principales

**Backend**
- Spring Boot 4.1.0
- Spring Data JPA + Hibernate
- Spring Security (BCrypt)
- PostgreSQL Driver
- Lombok

**Frontend**
- React 19
- Vite 8
- Axios
- React Router DOM

---

## Script de creación de tablas

```sql
CREATE TABLE IF NOT EXISTS users (
    id       BIGSERIAL PRIMARY KEY,
    username VARCHAR(50)  NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name     VARCHAR(100) NOT NULL,
    email    VARCHAR(100),
    role     VARCHAR(20)  NOT NULL DEFAULT 'USER',
    active   BOOLEAN      NOT NULL DEFAULT TRUE
);
```
