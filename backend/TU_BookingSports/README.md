## TU_BookingSports Backend – Auth Overview

This backend integrates Thammasat University TUAPI for authentication. The app verifies user credentials with TUAPI, upserts the user profile into our `users` table, and issues HttpOnly JWT cookies for session handling.

### Endpoints
- `POST /auth/login` – Verify with TUAPI, set `access_token` and `refresh_token` cookies
- `GET /auth/me` – Return current user profile from `access_token`
- `POST /auth/refresh` – Issue new `access_token` from `refresh_token`
- `POST /auth/logout` – Clear both cookies
- `GET /health` – Health check (200 OK)

### Files
- Controller: `src/main/java/com/example/tu_bookingsports/controller/AuthController.java`
- Service: `src/main/java/com/example/tu_bookingsports/service/AuthService.java`
- TUAPI client: `src/main/java/com/example/tu_bookingsports/service/TuApiClient.java`
- JWT utils: `src/main/java/com/example/tu_bookingsports/config/JwtUtils.java`
- User entity: `src/main/java/com/example/tu_bookingsports/model/User.java`

---

## Sequence Diagrams

### Login
```mermaid
sequenceDiagram
  participant FE as Frontend
  participant AC as AuthController (/auth/login)
  participant AS as AuthService
  participant TA as TuApiClient
  participant TU as TU API (POST /auth/Ad/verify)
  participant UR as UserRepository
  participant JW as JwtUtils

  FE->>AC: POST /auth/login {username,password}
  AC->>AS: login(req)
  AS->>TA: verify(username,password)
  TA->>TU: POST /auth/Ad/verify (Application-Key)
  TU-->>TA: { status, type, username, email, ... }
  TA-->>AS: TuApiVerifyResponse
  AS->>UR: findByEmail(email) || findByUsername(username)
  UR-->>AS: Optional<User>
  AS->>AS: map TU fields -> User (type, username, email, tu_status, statusid, displayname_th, displayname_en)\npassword="TUAPI" if null
  AS->>UR: save(user)
  UR-->>AS: User
  AS->>JW: generateToken(email, {type,username}) -> access
  AS->>JW: generateToken(email, {}) -> refresh
  AS-->>AC: LoginResponse(access, refresh)
  AC-->>FE: 200 + Set-Cookie access_token, refresh_token
```

### Get Me
```mermaid
sequenceDiagram
  participant FE as Frontend
  participant AC as AuthController (/auth/me)
  participant AS as AuthService
  participant JW as JwtUtils
  participant UR as UserRepository

  FE->>AC: GET /auth/me (Cookie: access_token)
  AC->>JW: isTokenValid(access_token)?
  JW-->>AC: valid/invalid
  alt invalid
    AC-->>FE: 401 error
  else valid
    AC->>JW: getSubject(access_token) -> email
    AC->>AS: getCurrentUser(token)
    AS->>JW: isTokenValid(token) + getSubject(token)
    AS->>UR: findByEmail(email)
    UR-->>AS: User
    AS-->>AC: User
    AC-->>FE: 200 UserResponse
  end
```

### Refresh Token
```mermaid
sequenceDiagram
  participant FE as Frontend
  participant AC as AuthController (/auth/refresh)
  participant JW as JwtUtils
  participant UR as UserRepository

  FE->>AC: POST /auth/refresh (Cookie: refresh_token)
  AC->>JW: isTokenValid(refresh_token)?
  alt invalid/missing
    AC-->>FE: 401 error
  else valid
    AC->>JW: getSubject(refresh_token) -> email
    AC->>UR: findByEmail(email)
    UR-->>AC: User
    AC->>JW: generateToken(email, {type,username}) -> new access
    AC-->>FE: 200 + Set-Cookie access_token (new)
  end
```

### Logout
```mermaid
sequenceDiagram
  participant FE as Frontend
  participant AC as AuthController (/auth/logout)

  FE->>AC: POST /auth/logout
  AC-->>FE: 200 OK + clear cookies (access_token, refresh_token)
```

---

## Configuration

### Environment (.env)
- `TUAPI_APPLICATION_KEY=` TUAPI Application-Key
- `DB_URL=` JDBC URL (SQL Server)
- `DB_USERNAME=`, `DB_PASSWORD=`
- `JWT_SECRET=` base64 or plain secret
- `JWT_EXPIRATION=` millis (e.g. 3600000)

### Properties
- `src/main/resources/application.properties`
  - `tuapi.base-url=https://restapi.tu.ac.th/api/v1/auth/Ad`
  - `tuapi.application-key=${TUAPI_APPLICATION_KEY:}`
  - `tuapi.insecure=true|false` (dev-only; bypass SSL validation to TUAPI)

### Database (Thai/Unicode)
- Ensure these columns are `NVARCHAR` in SQL Server:
  - `displayname_th`, `displayname_en`, `tu_status`
- Example migration:
```
ALTER TABLE dbo.users ALTER COLUMN displayname_th NVARCHAR(255) NULL;
ALTER TABLE dbo.users ALTER COLUMN displayname_en NVARCHAR(255) NULL;
ALTER TABLE dbo.users ALTER COLUMN tu_status NVARCHAR(255) NULL;
```

---

## Quick Test (Postman)
- POST `http://localhost:8081/auth/login` with `{ "username":"<tu_user>", "password":"<tu_pass>" }`
- GET `http://localhost:8081/auth/me` (cookies sent automatically)
- POST `http://localhost:8081/auth/refresh`
- POST `http://localhost:8081/auth/logout`
