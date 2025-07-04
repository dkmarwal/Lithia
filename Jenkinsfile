pipeline {
    agent none
    stages {
		stage('Sonar Code Quality') {
            when {
                branch 'lt_aws'
            }
            agent {label 'master'}
			environment {
				scannerHome = tool 'sonar-cli'
			}
            steps {
                script {
					withSonarQubeEnv('sonar') {
						sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=consumer-portal"
					}
				}
            }
        }
        stage('Install NodeJS dependencies') {
            when {
                branch 'lt_aws'
            }
            agent {label 'master'}
            steps {
                dir('./SourceCode/Frontend/consumer_portal') {
					sh 'npm  install'
                }
				dir('./SourceCode/Frontend/consumer_portal/server') {
					sh 'npm  install'
                }
            }
        }
        stage('Build NodeJS') {
            when {
                branch 'lt_aws'
            }
            agent {label 'master'}
            steps {
                dir('./SourceCode/Frontend/consumer_portal') {
					sh 'REACT_APP_STAGE=USBANK_DEV PUBLIC_URL=/ yarn build'
					sh 'cp -r build server/'
                }
            }
        }
        stage('Deploy_UAT') {
            when {
                branch 'lt_aws'
            }
            agent {label 'master'}
            steps {
                input 'Deploy to UAT?'
                milestone(1)
                sshPublisher(publishers: [sshPublisherDesc(configName: 'linux_webserver', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '''pwd; chmod +x /consumer_portal/deploy_run.sh; sh /consumer_portal/deploy_run.sh;''', execTimeout: 30000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: 'consumer_portal', remoteDirectorySDF: false, removePrefix: 'SourceCode/Frontend/consumer_portal/server', sourceFiles: 'SourceCode/Frontend/consumer_portal/server/**/*')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])			
            }
            post {
		       always {
                    cleanWs()
               }
            }
        }
    }
}
