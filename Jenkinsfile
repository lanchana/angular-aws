pipeline {
   agent any
      environment {
         PATH='/usr/local/bin:/usr/bin:/bin'
      }

   stages {
      stage('NPM Setup') {
          steps {
              sh 'npm install'
          }
      }

      stage('Stage Web Build') {
          steps {
              script {
                  if(env.BRANCH_NAME == 'master') {
                      sh 'npm run build:prod'
                  } else {
                      sh 'npm run build:staging'
                  }
              }
          }
      }

       stage('upload artifacts to S3') {
          steps {
              script {
                  if(env.BRANCH_NAME == 'master') {
                      withAWS(region:'us-east-1',profile:'jenkins-angular-aws') {
                          s3Upload(file:'dist', bucket:'com.test.compare-userinfo', path:'')
                      }
                  } else if(env.BRANCH_NAME == 'development') {
                      withAWS(region:'us-east-1',profile:'jenkins-angular-aws') {
                          s3Upload(file:'dist', bucket:'com.test.compare-userinfo', path:'')
                      }
                  }
              }
          }
       }
   }
   post {
      success {
          echo 'Build successful'
          mail to: 'lanchanagupta@gmail.com',
                       subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                       body: "Something is wrong with ${env.BUILD_URL}"
      }
      failure {
          echo 'Build failure'
          mail to: 'lanchanagupta@gmail.com',
                                 subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                                 body: "Something is wrong with ${env.BUILD_URL}"
      }
   }
}
