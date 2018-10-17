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
              sh 'npm run build:prod'
        }
      }

       stage('upload artifacts to S3') {
          if(env.BRANCH_NAME == 'master') {
              steps {
                    withAWS(region:'us-east-1',profile:'jenkins-angular-aws') {
                        s3Upload(file:'dist', bucket:'com.test.compare-userinfo', path:'')
                    }
              }
          } else if(env.BRANCH_NAME == 'development') {
              steps {
                  withAWS(region:'us-east-1',profile:'jenkins-angular-aws') {
                      s3Upload(file:'dist', bucket:'com.test.compare-userinfo', path:'')
                  }
              }
          }
       }
   }
}
