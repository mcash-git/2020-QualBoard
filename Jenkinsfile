pipeline {
  agent any
  stages {
    stage('Clean') {
      steps {
        dir('node_modules') {
          deleteDir()
        }
        dir('dist') {
          deleteDir()
        }
      }
    }
    stage('GitVersion') {
      when {
        anyOf {
          branch 'master'; branch 'develop'; branch 'release/*';
        }
      }
      steps {
        sh './build.sh -t Version'
        script {
          def displayName = readFile('./artifacts/version')
          currentBuild.displayName = displayName
        }
      }
    }
    stage('CI') {
      when {
        anyOf {
          branch 'master'; branch 'develop'; branch 'release/*'; branch 'PR-*';
        }
      }
      steps {
          sh './build.sh -t CI'
      }
    }
    stage('Production Build') {
      when {
        anyOf {
          branch 'master'; branch 'develop'; branch 'release/*';
        }
      }
      steps {
        sh './build.sh -t ProdBuild'
      }
    }
    stage('Generate Dev Release Notes') {
      when {
        anyOf {
          branch 'develop';
        }
      }
      steps {
        withCredentials([string(credentialsId: '1dfd233d-72be-4aaa-89ad-aa448f84e206', variable: 'GITHUB_TOKEN')]) {
          sh 'github_changelog_generator -t $GITHUB_TOKEN --unreleased-only --max-issues 1000 --output $(pwd)/artifacts/CHANGELOG.md'
        }
      }
    }
    stage('Generate Release Branch Release Notes') {
      when {
        anyOf {
          branch 'release/*';
        }
      }
      steps {
        withCredentials([string(credentialsId: '1dfd233d-72be-4aaa-89ad-aa448f84e206', variable: 'GITHUB_TOKEN')]) {
          //Tag the Repo so we can generate release notes
          //sh 'git tag -a $(cat $(pwd)/artifacts/version)'
          //sh 'git push origin $(cat $(pwd)/artifacts/version)'
          //Generate Release Notes
          //sh 'github_changelog_generator -t $GITHUB_TOKEN --no-unreleased --max-issues 1000 --output $(pwd)/artifacts/CHANGELOG.md --between-tags $(cat $(pwd)/artifacts/version)'
        }
      }
    }
    stage('Generate Master Release Notes') {
      when {
        anyOf {
          branch 'master';
        }
      }
      steps {
        withCredentials([string(credentialsId: '1dfd233d-72be-4aaa-89ad-aa448f84e206', variable: 'GITHUB_TOKEN')]) {
          sh 'github_changelog_generator -t $GITHUB_TOKEN --no-unreleased --max-issues 1000 --output $(pwd)/artifacts/CHANGELOG.md --between-tags $(cat $(pwd)/artifacts/version)'
        }
      }
    }
    stage('Finalize Release Notes') {
      when {
        anyOf {
          branch 'master'; branch 'develop'; branch 'release/*';
        }
      }
      steps {
        //Add Jenkins build information to Changelog
        sh 'echo "<br/><br/>Jenkins - Branch: $GIT_BRANCH - Build: [$BUILD_NUMBER]($BUILD_URL)" >> $(pwd)/artifacts/CHANGELOG.md'
      }
    }
    stage('Create Octopus Release') {
      when {
        anyOf {
          branch 'master'; branch 'develop'; branch 'release/*';
        }
      }
      steps {
        withEnv(['OCTO_URI=https://octopus.2020ip.io/']) {
          withCredentials([string(credentialsId: '62a56780-2c89-4d99-bb46-0383498e01c4', variable: 'OCTO_API_KEY')]) {
            sh 'octo pack --id QualBoard-Web --format Zip --version $(cat $(pwd)/artifacts/version) --basePath dist/ --outFolder artifacts/ --verbose'
            sh 'octo push --package $(ls artifacts/*.zip| head -n 1) --replace-existing --server $OCTO_URI --apiKey $OCTO_API_KEY'
            sh 'octo create-release --project Qualboard-Web --version $(cat $(pwd)/artifacts/version) --packageVersion $(cat $(pwd)/artifacts/version) --server $OCTO_URI --apiKey $OCTO_API_KEY --ignoreExisting --releasenotesfile $(pwd)/artifacts/CHANGELOG.md'
          }
        }
      }
    }
    stage('Deploy Octopus Release') {
      when {
        anyOf {
          branch 'develop';
        }
      }
      steps {
        withEnv(['OCTO_URI=https://octopus.2020ip.io/']) {
          withCredentials([string(credentialsId: '62a56780-2c89-4d99-bb46-0383498e01c4', variable: 'OCTO_API_KEY')]) {
            sh 'octo deploy-release --project Qualboard-Web --version $(cat $(pwd)/artifacts/version) --server $OCTO_URI --apiKey $OCTO_API_KEY --deployto=Dev'
          }
        }
      }
    }
  }
}
