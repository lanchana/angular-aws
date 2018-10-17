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

       /* stage('delete artifacts from S3') {
          steps {
                        script {
                            if(env.BRANCH_NAME == 'master') {
                                withAWS(region:'us-east-1',profile:'jenkins-angular-aws') {
                                    s3Delete(bucket:'com.test.compare-userinfo', path:'')
                                }
                            } else if(env.BRANCH_NAME == 'development') {
                                withAWS(region:'us-east-1',profile:'jenkins-angular-aws') {
                                    s3Delete(bucket:'com.test.compare-userinfo', path:'')
                                }
                            }
                        }
                    }
       } */

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
      }
      failure {
          echo 'Build failure'
          echo 'Failed Pipeline: ${currentBuild.fullDisplayName}'
          echo 'Something is wrong with ${env.BUILD_URL}'
      }
   }
}
