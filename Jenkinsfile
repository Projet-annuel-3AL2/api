pipeline {
  agent {
    node {
      label 'API node'
    }

  }
  stages {
    stage('Get package from git') {
      steps {
        git(url: 'https://github.com/Projet-annuel-3AL2/api.git', branch: 'main')
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }

  }
  environment {
    PORT = '4500'
    DB_HOST = 'pooetitu.xyz'
    DB_NAME = 'postgres'
    DB_PORT = '5432'
    DB_USER = 'postgres'
    DB_PASSWORD = 'postgres'
    DB_SCHEMA_OA = 'organization-app'
    DB_SCHEMA_APT = 'agir-pour-tous'
    ORG_APP_SECRET = 'QZg4vjk5yuz24fTvqZQzqgeQZFZYgzUZfJ23'
    APT_SECRET = 'QZg4vjk5yuz24fTvqZQzqgeaQgZAFZYgzUZfJ23'
  }
}