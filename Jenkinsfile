// Pipeline Jenkins para CI/CD: Build → Test → Push → Deploy
pipeline {
  // Ejecutar en cualquier agente disponible
  agent any

  // Variables de entorno del pipeline
  environment {
    // Credenciales del registry de Docker (configurar en Jenkins)
    REGISTRY = credentials('docker-registry-url')
    REGISTRY_USER = credentials('docker-username')
    REGISTRY_PASS = credentials('docker-password')
    
    // Nombre de la imagen (configurable, por defecto: jenkins-docker-ci-app)
    IMAGE_NAME = env.IMAGE_NAME ?: 'jenkins-docker-ci-app'
    
    // Tag de la imagen (configurable, por defecto: número de build)
    IMAGE_TAG = env.IMAGE_TAG ?: "${env.BUILD_NUMBER}"
    
    // Imagen completa con registry para push
    FULL_IMAGE = "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
  }

  // Opciones del pipeline
  options {
    skipDefaultCheckout(true)  // Saltar checkout automático, lo haremos manualmente
    timestamps()               // Mostrar timestamps en los logs
  }

  // Etapas del pipeline
  stages {
    // Etapa 1: Obtener código del repositorio
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    // Etapa 2: Construir la imagen Docker
    stage('Build Image') {
      steps {
        sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'
      }
    }

    // Etapa 3: Ejecutar tests unitarios dentro del contenedor
    stage('Unit Tests') {
      steps {
        sh 'docker run --rm ${IMAGE_NAME}:${IMAGE_TAG} node --test --test-reporter=spec'
      }
    }

    // Etapa 4: Etiquetar y subir imagen al registry (solo en main o si PUSH=true)
    stage('Tag & Push') {
      when {
        // Ejecutar solo si estamos en main o si la variable PUSH está activada
        expression { return env.PUSH?.toBoolean() || env.BRANCH_NAME == 'main' }
      }
      steps {
        // Login al registry usando password por stdin (más seguro)
        sh 'echo ${REGISTRY_PASS} | docker login ${REGISTRY} -u ${REGISTRY_USER} --password-stdin'
        
        // Etiquetar la imagen con el nombre completo del registry
        sh 'docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${FULL_IMAGE}'
        
        // Subir la imagen al registry
        sh 'docker push ${FULL_IMAGE}'
      }
    }

    // Etapa 5: Desplegar la aplicación (solo en main o si DEPLOY=true)
    stage('Deploy') {
      when {
        // Ejecutar solo si estamos en main o si la variable DEPLOY está activada
        expression { return env.DEPLOY?.toBoolean() || env.BRANCH_NAME == 'main' }
      }
      steps {
        // Detener contenedores existentes (ignorar error si no hay)
        sh 'docker compose down || true'
        
        // Levantar nuevos contenedores con la imagen recién construida
        // --pull always: intentar actualizar la imagen si existe
        // --force-recreate: recrear contenedores aunque la imagen no haya cambiado
        sh 'IMAGE_NAME=${FULL_IMAGE} IMAGE_TAG=${IMAGE_TAG} docker compose up -d --pull always --force-recreate'
      }
    }
  }

  // Acciones post-pipeline (siempre se ejecutan, incluso si falla)
  post {
    always {
      // Cerrar sesión del registry para limpiar credenciales
      sh 'docker logout ${REGISTRY} || true'
    }
  }
}



