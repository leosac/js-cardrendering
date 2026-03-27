pipeline {
    agent any
	stages {
	    stage('Build') {
            steps {
                nodejs(nodeJSInstallationName: 'node20') {
					sh 'corepack enable'
                    sh 'yarn install --frozen-lockfile'
					sh 'yarn run build'
                }
            }
        }
        stage('Sonar') {
            environment {
                scannerHome = tool 'SonarQube Scanner default'
            }
            steps {
                withSonarQubeEnv('SonarQube Community') {
                    sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=leosac_js-cardrendering_a752d80c-57a4-433e-b006-bc9a6a697738"
                }
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate(abortPipeline: true)
                }
            }
            when {
                anyOf {
                    branch 'main'
                    buildingTag()
                    changeRequest()
                }
            }
        }
    }
}