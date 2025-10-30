## Entrega - Despliegue automatizado de contenedores con Jenkins y Docker

Esta documentación mapea los criterios de la rúbrica a la implementación del proyecto.

### 1) Objetivo y alcance
- Objetivo: Pipeline CI/CD que construye, prueba y despliega automáticamente una app web contenedorizada.
- Alcance: App Node.js + Express, Docker, Jenkins (CD) y GitHub Actions (CI).

Evidencia:
- Código: `app/`, `Dockerfile`, `docker-compose.yml`
- Pipelines: `Jenkinsfile`, `.github/workflows/ci.yml`

### 2) Arquitectura y diseño
- Arquitectura: Front estático servido por Express + API simple, empaquetado en una imagen Docker minimalista (Node 20 Alpine).
- Estándares: Endpoints `/`, `/health`, `/api/greeting`. Static assets en `app/public`.

Evidencia:
- `app/src/app.js` (ruteo, estáticos, healthcheck)
- `app/public/` (landing y estilos)

### 3) Integración Continua (CI)
- GitHub Actions ejecuta build de imagen y tests en cada push/PR.
- En tags, construye y publica la imagen al registry configurado por secretos.

Evidencia:
- `.github/workflows/ci.yml` (jobs `build-test` y `push-image`)
- Tests: `app/test/greet.test.js`

### 4) Entrega/Despliegue Continuo (CD)
- Jenkins construye la imagen, ejecuta tests, hace login al registry, etiqueta y empuja (condicional), y despliega con `docker compose`.
- Variables controlan push/deploy fuera de `main` (`PUSH`, `DEPLOY`).

Evidencia:
- `Jenkinsfile` (stages `Build Image`, `Unit Tests`, `Tag & Push`, `Deploy`)

### 5) Contenerización y reproducibilidad
- `Dockerfile` con instalación `--omit=dev` para imagen pequeña.
- `.dockerignore` reduce el contexto de build.
- `docker-compose.yml` permite ejecución consistente local/despliegue simple.

Evidencia:
- `Dockerfile`, `.dockerignore`, `docker-compose.yml`

### 6) Calidad (pruebas y checks)
- Tests unitarios con `node:test`.
- Endpoint `/health` para orquestación y verificación pos-despliegue.

Evidencia:
- `app/test/greet.test.js`, `GET /health`

### 7) Seguridad y credenciales
- Jenkins: credenciales `docker-registry-url`, `docker-username`, `docker-password`.
- Actions: secretos `DOCKER_REGISTRY`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`.
- Login al registry mediante `--password-stdin`.

Evidencia:
- `Jenkinsfile` (login), `ci.yml` (login-action)

### 8) Operación, despliegue y rollback
- Despliegue: `docker compose up -d` en host Jenkins.
- Logs: `docker compose logs -f`.
- Rollback: usar tag anterior (por ejemplo `IMAGE_TAG=<tag-previo>` + `docker compose up -d`).

Evidencia:
- `docker-compose.yml`, sección README Operación

### 9) Documentación y uso
- README con objetivo, arquitectura, requisitos, uso local, Jenkins y Actions, evidencias rápidas.
- Este documento mapea la rúbrica.

Evidencia:
- `README.md`, `docs/ENTREGA.md`

### 10) Demostración y verificación
- Comandos de demostración incluidos en README (build, test, up, curl a `/health` y `/api/greeting`).
- Landing con estilo en `/` para validación visual.

Evidencia:
- `app/public/index.html`, sección “Evidencias rápidas” del README

---

Guía rápida (para el revisor)
```bash
docker build -t jenkins-docker-ci-app:dev .
docker run --rm jenkins-docker-ci-app:dev node --test --test-reporter=spec
docker compose up -d
curl http://localhost:3000/health
curl http://localhost:3000/api/greeting
```

Notas de mejora (futuro):
- Reemplazar Deploy por Helm/Kubernetes con `readinessProbe`/`livenessProbe`.
- Añadir escaneo de imagen (Trivy) y SAST en CI.
- Versionado semántico automatizado (SemVer + release tags).


