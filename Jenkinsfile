pipeline {
  agent any

  environment {
    APP_NAME = 'sample-btp-app'
    CF_API = 'https://api.cf.us10-001.hana.ondemand.com'
    CF_ORG = '2345977etrial'   
    CF_SPACE = 'dev'

    MAJOR = '1'
    MINOR = '0'
    VERSION = "${MAJOR}.${MINOR}.${BUILD_NUMBER}"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Show Version') {
      steps {
        echo "🚀 Deploying version ${VERSION}"
      }
    }

    stage('Login to SAP BTP CF') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'cf-btp-trial',
          usernameVariable: 'CF_USER',
          passwordVariable: 'CF_PASS'
        )]) {
          bat '''
            cf api %CF_API%
            cf auth %CF_USER% %CF_PASS%
            cf target -o "%CF_ORG%" -s "%CF_SPACE%"
          '''
        }
      }
    }

    stage('Deploy to SAP BTP') {
      steps {
        bat """
          cf push ${APP_NAME} --var APP_VERSION=${VERSION}
        """
      }
    }

    stage('Git Tag') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'github-pat',
          usernameVariable: 'GIT_USER',
          passwordVariable: 'GIT_PAT'
        )]) {
          bat """
            git config user.email "jenkins@local"
            git config user.name "Jenkins"

            git tag v%VERSION%
            git push https://%GIT_USER%:%GIT_PAT%@github.com/peppemacario-ship-it/sample-btp-app-new.git v%VERSION%
          """
        }
      }
    }

  }

  post {
    success {
      echo "✅ Deployed version ${VERSION}"
    }
  }
}