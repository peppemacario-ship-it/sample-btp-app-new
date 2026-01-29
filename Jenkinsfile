pipeline {
  agent any

  environment {
    CF_API = 'https://api.cf.eu10.hana.ondemand.com'
    CF_ORG = 'trial'
    CF_SPACE = 'dev'
  }

  stages {
    stage('Checkout') {
      steps {
        echo 'Checkout repository'
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
        bat 'cf push'
      }
    }
  }
}