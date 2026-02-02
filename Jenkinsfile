pipeline {
  agent any

  environment {
    APP_NAME = 'sample-btp-app'
    CF_API = 'https://api.cf.us10-001.hana.ondemand.com'
    CF_ORG = '2345977etrial'   
    CF_SPACE = 'dev'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Check Node') {
      steps {
        bat '''
      node -v
      npm -v
    '''
  }
}

    stage('Install Dependencies') {
      steps {
        bat 'npm install'
      }
    }
    

    stage('Semantic Release') {
      steps {
        withCredentials([string(
          credentialsId: 'github-token',
          variable: 'GITHUB_TOKEN'
        )]) {
          bat 'npx semantic-release'
        }
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
        bat '''
          for /f %%i in ('git describe --tags --abbrev=0') do set APP_VERSION=%%i
          cf push %APP_NAME% --var APP_VERSION=%APP_VERSION%
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Release, tag e deploy completati"
    }
  }
}