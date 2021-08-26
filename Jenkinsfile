#!groovy
def props
def LBURL=null
pipeline {
	agent { label 'linux' }

	environment {
		TERRAFORM_VERSION="0.12.26"
		SONARHOST = "http://192.238.57.4:8080"
		SONARTOKEN = credentials("sonarkey")
	}

	options {
        buildDiscarder(logRotator(daysToKeepStr: '10', artifactNumToKeepStr: '10'))
		disableConcurrentBuilds()
	}

    stages {
		stage ("Install Python Dependencies") {
			when { anyOf { branch 'master'; branch 'development' } }
				steps {
					script { current_stage = env.STAGE_NAME }
					sh "apt-get update"
					sh "apt-get install -y software-properties-common build-essential python3-pip libmysqlclient-dev"
					sh "pip3 install -r requirements.txt"
				   }
			}
				
		stage ("Python Lint") {
			when { anyOf { branch 'master'; branch 'development' } }
                steps {
						sh "apt-get update"
						sh "apt-get install -y software-properties-common build-essential python3-pip"
						sh "sudo -H pip3 install --ignore-installed PyYAML"
						sh "pip3 install -r requirements.txt"			
                        sh "python3 -m pylint manage.py OpsMate patch_management || exit 0"
                   }
            }  // end lint	

        stage('npm Lint and unit test') {
			when { anyOf { branch 'master'; branch 'development' } }
			agent {
				docker{
					registryCredentialsId 'dockerpublicregistrycredentials'
					image 'node:14-alpine'
					args '-u root:root -v "/var/run/docker.sock:/var/run/docker.sock:rw"'
					args '-v $WORKSPACE:/tmp/sbapp -u="root" -w /tmp/sbapp'
				}
			} 
            steps {
					echo 'Building dependencies...'
					sh '''
					npm i
					npm config ls
					cd patch_frontend/src
					npm install -g eslint
					npm install -g nyc
					npm install -g cross-env
					npm install
					eslint ./
					nyc --reporter=lcov --reporter=text-lcov npm test
					npm run coverage-check
					'''
			} // end steps
		}  // end stage


	   stage('Static Code Analysis') {
		   when { anyOf { branch 'master'; branch 'development' } }
	       steps {
	 	     
		     //install sonarqube tool
		     // run a sonarqube scan
		     //sh ''' 

		     sh 'apt update'
		     sh 'apt-get install -y openjdk-8-jdk' 	     	       
		     
		     sh 'wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.3.0.1492-linux.zip'
		     
		     sh 'unzip sonar-scanner-cli-3.3.0.1492-linux.zip -d sonar2'
		     
		     sh 'PATH="$PATH:sonar2/sonar-scanner-3.3.0.1492-linux/bin/"'
		     		     
		     //sonar-scanner -Dsonar.host.url=http://3.222.181.167:9000 -Dsonar.sources=. -Dsonar.projectKey=example:python-docker
		     sh "sonar2/sonar-scanner-3.3.0.1492-linux/bin/sonar-scanner -Dsonar.host.url=$SONARHOST -Dsonar.login=$SONARTOKEN -Dsonar.sources=. -Dsonar.projectKey=OpsMate:patchmanagement-app"

			 sh 'rm -rf sonar-scanner-cli-3.3.0.1492-linux.zip sonar2'
		    // '''		       
		}  // end steps
	    }  //end stage static test	

		stage ("Application Test") {
			when { anyOf { branch 'master'; branch 'development' } }
				steps {
					script { current_stage = env.STAGE_NAME }
			sh 'echo unit testing'
			sh "py.test"
				   }
			}
		stage ("Build Image") {
			when { anyOf { branch 'master'; branch 'development' } }
			// 	agent {
			// 	dockerfile{
			// 		registryCredentialsId 'dockerpublicregistrycredentials'
			// 		filename 'Dockerfile'
			// 		dir '.'
			// 		args '--tag opstool-patchmanagement'
			// 	}
			// }
			steps {
				script {current_stage = env.STAGE_NAME}
						withCredentials ([usernamePassword(credentialsId: 'dockerpublicregistrycredentials', usernameVariable: 'DOCKER_REGISTRY_USER', passwordVariable: 'DOCKER_REGISTRY_PWD')])
						{
							sh """
							docker login -u "${DOCKER_REGISTRY_USER}" -p "${DOCKER_REGISTRY_PWD}"
							docker build --tag opstool-patchmanagement --file Dockerfile .
							"""
						}
				}
			}

		stage ("Publish Image for development") {
			when { branch 'development' }
				steps {
					script { current_stage = env.STAGE_NAME }
					echo "Deploy Image to Artifactory"
					withCredentials ([usernamePassword(credentialsId: 'aatopstool', usernameVariable: 'ARTIFACTORY_USER', passwordVariable: 'ARTIFACTORY_PASSWORD')])
									{
										sh """
										docker login artifactory.dxc.com/aatopstool-docker -u "${ARTIFACTORY_USER}" -p "${ARTIFACTORY_PASSWORD}"
										docker tag opstool-patchmanagement artifactory.dxc.com/aatopstool-docker/opstool-patchmanagement:development
										docker tag opstool-patchmanagement artifactory.dxc.com/aatopstool-docker/opstool-patchmanagement:"${env.BUILD_NUMBER}"
										docker push artifactory.dxc.com/aatopstool-docker/opstool-patchmanagement:development
										docker push artifactory.dxc.com/aatopstool-docker/opstool-patchmanagement:"${env.BUILD_NUMBER}"
										"""
									}
	
			   }  // end steps
			} // end stage
		stage ("Publish Image for release") {
			when { branch 'master' }
				steps {
					script { current_stage = env.STAGE_NAME }
					echo "Deploy master Image to Artifactory"
					withCredentials ([usernamePassword(credentialsId: 'aatopstool', usernameVariable: 'ARTIFACTORY_USER', passwordVariable: 'ARTIFACTORY_PASSWORD')])
									{
										sh """
										docker login artifactory.dxc.com/aatopstool-docker -u "${ARTIFACTORY_USER}" -p "${ARTIFACTORY_PASSWORD}"
										docker tag opstool-patchmanagement artifactory.dxc.com/aatopstool-docker/opstool-patchmanagement:latest
										docker tag opstool-patchmanagement artifactory.dxc.com/aatopstool-docker/opstool-patchmanagement:1.0.0
										docker push artifactory.dxc.com/aatopstool-docker/opstool-patchmanagement:latest
										docker push artifactory.dxc.com/aatopstool-docker/opstool-patchmanagement:1.0.0
										"""
									}
	
			   }  // end steps
			} // end stage

		stage ("Deploy to AWS environment") {
			when { branch 'ignore-deployment' }
				steps {
					script { current_stage = env.STAGE_NAME }
					echo "Provision aws resources"
					withCredentials (
									[
										[
              								$class: 'AmazonWebServicesCredentialsBinding',
              								credentialsId: 'opstool_aws',
              								accessKeyVariable: 'AWS_ACCESS_KEY_ID',
              								secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
            							],
										[
											$class: 'UsernamePasswordMultiBinding',
											credentialsId: 'aatopstool', 
											usernameVariable: 'ARTIFACTORY_USER', 
											passwordVariable: 'ARTIFACTORY_PASSWORD'
										]
									]
								)
									{
										sh '''
											cd deployment/test
											chmod +x deploy.sh
											./deploy.sh
											'''
									}
					script {
                    	props = readProperties file:"${WORKSPACE}/env.props";
						LBURL = props['LBDNSURL']
               		}
			   	} //end steps
		}  // end stage
		stage ("Send success notification") {
			when { anyOf { branch 'master'; branch 'development' } }
				steps {
					script { current_stage = env.STAGE_NAME }
					echo "Send notification to MS Teams channel - AAT - Jenkins"
					withCredentials([string(credentialsId: 'MSTeamsWebhookURL', variable: 'aatteamswebhookurl')]) {
					office365ConnectorSend webhookUrl: "${aatteamswebhookurl}",
					message: "Opstool application is being deployed to test environment in AWS. Please access the application using the link http://${LBURL}/ after few minutes. This environment will be shutdown at 7PM IST.",
					status: 'Success'
					}
				}
		}

	}  /// end main stages

    post {
		failure {
			withCredentials([string(credentialsId: 'MSTeamsWebhookURL', variable: 'aatteamswebhookurl')]) {
					office365ConnectorSend webhookUrl: "${aatteamswebhookurl}",
					message: "Application failed to deploy. Pipeline failed at stage \"${current_stage}\"",
					status: 'Failed'
			}
		}
		unstable {
			withCredentials([string(credentialsId: 'MSTeamsWebhookURL', variable: 'aatteamswebhookurl')]) {
				office365ConnectorSend webhookUrl: "${aatteamswebhookurl}",
				message: 'Build is unstable',
				status: 'Unstable'
			}
		}
        always {
            deleteDir()
        }
	}

}  // end pipeline
