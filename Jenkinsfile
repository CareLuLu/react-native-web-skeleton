pipeline {
  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }
  environment {
    NODE_ENV = 'test'
    GIT_NAME = """${sh(
      returnStdout: true,
      script: 'git --no-pager show -s --format=\'%an\' ${GIT_COMMIT}'
    ).trim()}"""
    GIT_COMMIT_SHORT = """${sh(
      returnStdout: true,
      script: 'git --no-pager show -s --format=\'%h\' ${GIT_COMMIT}'
    ).trim()}"""
    GIT_COMMIT_URL = "${env.GIT_URL[0..-5]}/commit/${env.GIT_COMMIT}"
    NODEJS_VERSION = "${readFile '.nvmrc'}".trim()
  }
  tools {
    nodejs env.NODEJS_VERSION
  }
  stages {
    stage('Setup') {
      steps {
        slackSend(color: '#D9D445', message: "STARTED: Build <${env.RUN_DISPLAY_URL}|#${env.BUILD_NUMBER}> (<${env.GIT_COMMIT_URL}|${env.GIT_COMMIT_SHORT}>) of ${env.JOB_NAME.replaceAll('%2F', '/')} by ${env.GIT_NAME}")
        sh 'node -v'
        sh 'npm install -g yarn'
        sh 'yarn -v'
        sh 'yarn'
      }
    }
    stage('Linter') {
      steps {
        script {
          sh "git diff --name-only --diff-filter=b \$(git merge-base HEAD master) | grep -e \"\\.js\$\" | xargs yarn eslint -c ./.eslintrc"
        }
      }
    }
    stage('Production') {
      when {
        branch 'master'
      }
      stages {
        stage('Build') {
          steps {
            script {
              withCredentials([file(credentialsId: "rnw-env-production", variable: "rnwEnv")]) {
                sh "cp \$rnwEnv .env"
              }
              sh 'yarn web:build'

              withCredentials([string(credentialsId: 'S3_BUCKET', variable: 'S3_BUCKET')]) {
                withAWS(credentials: "aws-credentials") {
                  s3Upload(bucket: "${S3_BUCKET}", path: "build/rnw-skeleton", includePathPattern: "**/*.js,**/*.map,**/*.ico", workingDir: "build", acl: "PublicRead", cacheControl: "public,max-age=31536000", contentEncoding: "gzip")
                  s3Upload(bucket: "${S3_BUCKET}", path: "build/rnw-skeleton/index.html", file: "build/index.html", acl: "PublicRead", cacheControl: "public,max-age=31536000")
                  s3Upload(bucket: "${S3_BUCKET}", path: "build/rnw-skeleton/asset-manifest.json", file: "build/asset-manifest.json", acl: "PublicRead", cacheControl: "public,max-age=31536000", contentEncoding: "gzip")
                  s3Upload(bucket: "${S3_BUCKET}", path: "build/rnw-skeleton/manifest.json", file: "build/manifest.json", acl: "PublicRead", cacheControl: "public,max-age=31536000", contentEncoding: "gzip")
                  s3Upload(bucket: "${S3_BUCKET}", path: "build/rnw-skeleton/.well-known/assetlinks.json", file: "build/.well-known/assetlinks.json", acl: "PublicRead", cacheControl: "public,max-age=31536000")
                  s3Upload(bucket: "${S3_BUCKET}", path: "build/rnw-skeleton/apple-app-site-association/index.json", file: "build/apple-app-site-association/index.json", acl: "PublicRead", cacheControl: "public,max-age=31536000")
                }
              }
            }
          }
        }
        stage('Deploy') {
          steps {
            script {
              withCredentials([string(credentialsId: 'EC2_USER', variable: 'EC2_USER')]) {
                DEPLOYMENT_HOST_1 = sh(returnStdout: true, script: "set +x && aws ec2 describe-instances --filters \"Name=tag:Name,Values=rnw-skeleton\" --query \"Reservations[*].Instances[*].PublicIpAddress\" --output=text && set -x").trim()
                DEPLOYMENT_VERSION_1 = sh(returnStdout: true, script: "set +x && ssh -oStrictHostKeyChecking=no ${EC2_USER}@${DEPLOYMENT_HOST_1} \"cat react-native-web-skeleton/.nvmrc\" && set -x").trim()
                DEPLOYMENT_COMMAND_1 = DEPLOYMENT_VERSION_1 == env.NODEJS_VERSION ? 'startOrRestart .pm2.json' : 'update'
                sh "set +x && scp -oStrictHostKeyChecking=no server/loadable-stats.json ${EC2_USER}@${DEPLOYMENT_HOST_1}:~/react-native-web-skeleton/server/loadable-stats.json && set -x"
                sh "set +x && scp -oStrictHostKeyChecking=no server/index.html ${EC2_USER}@${DEPLOYMENT_HOST_1}:~/react-native-web-skeleton/server/index.html && set -x"
                sh "set +x && scp -oStrictHostKeyChecking=no build/manifest.json ${EC2_USER}@${DEPLOYMENT_HOST_1}:~/react-native-web-skeleton/build/manifest.json.gz && set -x"
                sh "set +x && scp -oStrictHostKeyChecking=no build/asset-manifest.json ${EC2_USER}@${DEPLOYMENT_HOST_1}:~/react-native-web-skeleton/build/asset-manifest.json.gz && set -x"
                sh "set +x && scp -oStrictHostKeyChecking=no build/.well-known/assetlinks.json ${EC2_USER}@${DEPLOYMENT_HOST_1}:~/react-native-web-skeleton/build/.well-known/assetlinks.json && set -x"
                sh "set +x && scp -oStrictHostKeyChecking=no build/apple-app-site-association/index.json ${EC2_USER}@${DEPLOYMENT_HOST_1}:~/react-native-web-skeleton/build/apple-app-site-association/index.json && set -x"
                sh "set +x && scp -oStrictHostKeyChecking=no build/index.html ${EC2_USER}@${DEPLOYMENT_HOST_1}:~/react-native-web-skeleton/build/index.html && set -x"
                sh "set +x && ssh -oStrictHostKeyChecking=no ${EC2_USER}@${DEPLOYMENT_HOST_1} \"sudo yum update -y && cd react-native-web-skeleton && git reset --hard HEAD && git pull && git checkout master && nvm install ${env.NODEJS_VERSION} && nvm alias default ${env.NODEJS_VERSION} && nvm use default && yarn install && yarn run pm2 ${DEPLOYMENT_COMMAND_1}\" && set -x"
              }
            }
          }
        }
        stage('Invalidation') {
          steps {
            script {
              withCredentials([string(credentialsId: 'CLOUDFRONT_DISTRIBUTION_ID', variable: 'CLOUDFRONT_DISTRIBUTION_ID')]) {
                withAWS(credentials: "aws-credentials") {
                  cfInvalidate(
                    distribution: "${CLOUDFRONT_DISTRIBUTION_ID}",
                    paths: [
                      '/react-native-web-example*'
                    ])
                }
              }
            }
          }
        }
      }
    }
  }
  post {
    failure {
      slackSend(color: '#A1080D', message: "FAILED: Build <${env.RUN_DISPLAY_URL}|#${env.BUILD_NUMBER}> (<${env.GIT_COMMIT_URL}|${env.GIT_COMMIT_SHORT}>) of ${env.JOB_NAME.replaceAll('%2F', '/')} by ${env.GIT_NAME}")
    }
    success {
      slackSend(color: '#38B585', message: "SUCCESSFUL: Build <${env.RUN_DISPLAY_URL}|#${env.BUILD_NUMBER}> (<${env.GIT_COMMIT_URL}|${env.GIT_COMMIT_SHORT}>) of ${env.JOB_NAME.replaceAll('%2F', '/')} by ${env.GIT_NAME}")
    }
    always {
      sh 'rm node_modules -rf'
      sh 'rm .env -f'
    }
  }
}
