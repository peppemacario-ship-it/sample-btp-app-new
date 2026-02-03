pipeline {
  agent any

  options {
    skipDefaultCheckout(true)
  }

  environment {
    APP_NAME = 'sample-btp-app'
    CF_API = 'https://api.cf.us10-001.hana.ondemand.com'
    CF_ORG = '2345977etrial'   
    CF_SPACE = 'dev'
  }

  stages {

    stage('Checkout') {
      steps {
         checkout([
           $class: 'GitSCM',
           branches: [[name: '*/main']],
           userRemoteConfigs: [[
             url: 'https://github.com/peppemacario-ship-it/sample-btp-app-new.git',
             credentialsId: 'github-pat'
      ]]
    ])
  }
}

    stage('Check commit message') {
      steps {
        script {
          def msg = bat(
            script: 'git log -1 --pretty=%%B',
            returnStdout: true
          ).trim()

          echo "📝 Last commit message: ${msg}"

          if (msg.startsWith('chore(release):')) {
            echo '🚫 Release commit detected → stopping pipeline'
            currentBuild.result = 'SUCCESS'
            return
          }
        }
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
          withEnv([
            'CI=true',
            'BRANCH_NAME=main'
          ]) {
            bat 'npx semantic-release'
          }
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

    stage('Resolve Version') {
      steps {
        script {
          def version = powershell(
            script: '''
             git fetch --tags
             git describe --tags --abbrev=0         
            ''',
            returnStdout: true
          ).trim()

          env.APP_VERSION = version
          echo "🚀 Deploying version ${env.APP_VERSION}"
        }
      }
    }

    stage('Deploy to SAP BTP') {
      steps {
        bat """
          cf push %APP_NAME% --var APP_VERSION=%APP_VERSION%
        """
      }
    }
  }

  post {
    success {
      echo "✅ Release, tag e deploy completati"
    }
  }
}