#!groovy

def tryStep(String message, Closure block, Closure tearDown = null) {
    try {
        block()
    }
    catch (Throwable t) {
        slackSend message: "${env.JOB_NAME}: ${message} failure ${env.BUILD_URL}", channel: '#ci-channel', color: 'danger'

        throw t
    }
    finally {
        if (tearDown) {
            tearDown()
        }
    }
}


node('GOBBUILD') {
    stage("Checkout") {
        checkout scm
    }

    stage('Test') {
        tryStep "test", {
            sh "docker-compose -f .jenkins/test/docker-compose.yml build --no-cache && " +
               "docker-compose -f .jenkins/test/docker-compose.yml run -u root --rm test"
        }, {
            sh "docker-compose -f .jenkins/test/docker-compose.yml down"
        }
    }

    stage("Build image") {
        tryStep "build", {
            docker.withRegistry('https://repo.data.amsterdam.nl','docker-registry') {
                def image = docker.build("datapunt/gob_admin:${env.BUILD_NUMBER}", "--no-cache .")
                image.push()
            }
        }
    }
}


String BRANCH = "${env.BRANCH_NAME}"


if (BRANCH == "develop") {

    node('GOBBUILD') {
        stage('Push develop image') {
            tryStep "image tagging", {
                docker.withRegistry('https://repo.data.amsterdam.nl','docker-registry') {
                    def image = docker.image("datapunt/gob_admin:${env.BUILD_NUMBER}")
                    image.pull()
                    image.push("develop")
                }
            }
        }
    }
}


if (BRANCH == "master") {

    node('GOBBUILD') {
        stage('Push acceptance image') {
            tryStep "image tagging", {
                docker.withRegistry('https://repo.data.amsterdam.nl','docker-registry') {
                    def image = docker.image("datapunt/gob_admin:${env.BUILD_NUMBER}")
                    image.pull()
                    image.push("acceptance")
                }
            }
        }
    }

    node('GOBBUILD') {
        stage("Deploy to ACC") {
            tryStep "deployment", {
                build job: 'Subtask_Openstack_Playbook',
                    parameters: [
                        [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
                        [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-gob-admin.yml'],
                    ]
            }
        }
    }

}
