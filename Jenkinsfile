pipeline {
  agent any

  environment {
    REGISTRY = credentials('docker-registry-url')
    REGISTRY_USER = credentials('docker-username')
    REGISTRY_PASS = credentials('docker-password')
    IMAGE_NAME = env.IMAGE_NAME ?: 'jenkins-docker-ci-app'
    IMAGE_TAG = env.IMAGE_TAG ?: "${env.BUILD_NUMBER}"
    FULL_IMAGE = "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
  }

  options {
    skipDefaultCheckout(true)
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Image') {
      steps {
        sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'
      }
    }

    stage('Unit Tests') {
      steps {
        sh 'docker run --rm ${IMAGE_NAME}:${IMAGE_TAG} node --test --test-reporter=spec'
      }
    }

    stage('Tag & Push') {
      when {
        expression { return env.PUSH?.toBoolean() || env.BRANCH_NAME == 'main' }
      }
      steps {
        sh 'echo ${REGISTRY_PASS} | docker login ${REGISTRY} -u ${REGISTRY_USER} --password-stdin'
        sh 'docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${FULL_IMAGE}'
        sh 'docker push ${FULL_IMAGE}'
      }
    }

    stage('Deploy') {
      when {
        expression { return env.DEPLOY?.toBoolean() || env.BRANCH_NAME == 'main' }
      }
      steps {
        sh 'docker compose down || true'
        sh 'IMAGE_NAME=${FULL_IMAGE} IMAGE_TAG=${IMAGE_TAG} docker compose up -d --pull always --force-recreate'
      }
    }
  }

  post {
    always {
      sh 'docker logout ${REGISTRY} || true'
    }
  }
}



