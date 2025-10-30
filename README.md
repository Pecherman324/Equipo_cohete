## Pipeline CI/CD con Jenkins, Docker y GitHub Actions

Este proyecto implementa un pipeline CI/CD que construye, prueba, empaqueta en contenedor y despliega una aplicación web (Node.js + Express) siguiendo prácticas de Integración y Entrega Continua.

### Objetivo
- Construir un pipeline CI/CD que despliegue automáticamente una aplicación web en contenedores (Docker), usando Jenkins y GitHub Actions.

### Arquitectura (alto nivel)
- App `Express` con endpoints `GET /` (landing estática), `GET /health`, `GET /api/greeting`.
- Contenedor Docker (Node 20 Alpine) + `docker-compose` para ejecución local y despliegue simple en host Jenkins.
- CI en GitHub Actions (build + tests por push/PR; push de imagen en tags).
- CD en Jenkins con stages: Checkout → Build Image → Unit Tests → Tag & Push (cond.) → Deploy (cond.).

### Estructura del repositorio
- `app/` código fuente y tests
- `Dockerfile` imagen de producción
- `docker-compose.yml` ejecución local/despliegue simple
- `Jenkinsfile` pipeline Jenkins
- `.github/workflows/ci.yml` pipeline de GitHub Actions
- `docs/ENTREGA.md` criterios de rúbrica y evidencias

### Requisitos
- Docker y Docker Compose
- Jenkins con Docker en el agente (para usar `Jenkinsfile`)

### Uso local (desarrollo y verificación)
```bash
# 1) Construir imagen
docker build -t jenkins-docker-ci-app:dev .
# 2) Ejecutar tests dentro del contenedor
docker run --rm jenkins-docker-ci-app:dev node --test --test-reporter=spec
# 3) Levantar el servicio y abrir la app
docker compose up -d
# http://localhost:3000 -> landing HTML/CSS
# http://localhost:3000/health -> {"status":"ok"}
# http://localhost:3000/api/greeting -> {"message":"Hola, Mundo!"}
```

### Jenkins (CD)
1) Crea credenciales (tipo “Secret text” o según tu registry):
   - `docker-registry-url` (ej: `ghcr.io` o `registry.hub.docker.com`)
   - `docker-username`
   - `docker-password`
2) Crea un Pipeline multibranch o uno por `Jenkinsfile`.
3) Variables útiles del pipeline:
   - `IMAGE_NAME` (por defecto `jenkins-docker-ci-app`)
   - `IMAGE_TAG` (por defecto `BUILD_NUMBER`)
   - `PUSH=true` para forzar push fuera de `main`
   - `DEPLOY=true` para forzar deploy fuera de `main`

Deploy: se realiza con `docker compose` en el mismo host Jenkins (modo sencillo). Para despliegues remotos (SSH, Kubernetes/Helm), sustituye el stage `Deploy` en `Jenkinsfile`.

### GitHub Actions (CI)
- Job `build-test`: corre en cada push/PR → build de imagen + ejecución de tests.
- Job `push-image` (tags): construye y publica la imagen. Requiere secretos del repo:
  - `DOCKER_REGISTRY` (ej: `ghcr.io/<org>`)
  - `DOCKER_USERNAME`
  - `DOCKER_PASSWORD`

### Calidad y pruebas
- Tests unitarios con `node:test` para la función de saludo.
- Endpoint `/health` para chequeo de vida en despliegue.

### Seguridad y buenas prácticas
- `.dockerignore` para reducir contexto y filtrar secretos/archivos de dev.
- `--omit=dev` en instalación para imagen más pequeña.
- Login al registry con `password-stdin` (no expone password en logs).

### Operación
- Logs: `docker compose logs -f`
- Parar: `docker compose down`
- Rebuild forzado: `docker compose build --no-cache && docker compose up -d`

### Evidencias rápidas (comandos)
```bash
# Build local
docker build -t jenkins-docker-ci-app:dev .
# Tests dentro del contenedor
docker run --rm jenkins-docker-ci-app:dev node --test --test-reporter=spec
# Despliegue local
docker compose up -d
# Salud y API
curl http://localhost:3000/health
curl http://localhost:3000/api/greeting
```

Para más detalle de criterios y cómo se cumplen, revisa `docs/ENTREGA.md`.
