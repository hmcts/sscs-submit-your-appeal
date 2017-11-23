#!groovy


//noinspection GroovyAssignabilityCheck Jenkins API requires this format
properties(
  [[$class: 'GithubProjectProperty', projectUrlStr: 'https://github.com/hmcts/submit-your-appeal/'],
   pipelineTriggers([[$class: 'hudson.triggers.TimerTrigger', spec  : 'H 1 * * *']])]
)
@Library('Reform')
import uk.gov.hmcts.Ansible
import uk.gov.hmcts.Packager
import uk.gov.hmcts.RPMTagger

Ansible ansible = new Ansible(this, 'sscs')
Packager packager = new Packager(this, 'sscs')

String channel = '#sscs-tech'

timestamps {
    milestone()
    lock(resource: "submit-your-appeal-${env.BRANCH_NAME}", inversePrecedence: true) {
        node {
            try {
                def syaFrontendRPMVersion
                def version
                def ansibleCommitId

                stage("Checkout") {
                    deleteDir()
                    checkout scm
                }

                stage("Install") {
                    sh 'make install-tactical'
                }

                stage("Unit test") {
                    sh 'make test'
                }

                stage("Code coverage") {
                    sh 'make test-coverage-tactical'
                    //sh 'make sonarscan-tactical'
                    publishHTML([
                            allowMissing         : false,
                            alwaysLinkToLastBuild: true,
                            keepAll              : true,
                            reportDir            : 'test/coverage/html/lcov-report',
                            reportFiles          : 'index.html',
                            reportName           : 'HTML Report'
                    ])
                }

                stage("Security checks") {
                    sh 'make test-nsp-tactical'
                }

                stage("a11y test") {
                    withEnv(["JUNIT_REPORT_PATH='test-reports.xml'"]) {
                        try {
                            sh 'make test-a11y-tactical'
                        } finally {
                            echo "not ready yet"
                        //    step([$class: 'JUnitResultArchiver', testResults: env.JUNIT_REPORT_PATH])
                        }
                    }
                }

                stage('Package application (RPM)') {
                    syaFrontendRPMVersion = packager.nodeRPM('submit-your-appeal')
                    version = "{submit_your_appeal_version: ${syaFrontendRPMVersion}}"

                    onMaster {
                        packager.publishNodeRPM('submit-your-appeal')
                    }
                }

                //noinspection GroovyVariableNotAssigned It is guaranteed to be assigned
                RPMTagger rpmTagger = new RPMTagger(this,
                'submit-your-appeal',
                packager.rpmName('submit-your-appeal', syaFrontendRPMVersion),
                'sscs-local'
                )

                onMaster {
                    milestone()
                    lock(resource: "sscs-frontend-dev-deploy", inversePrecedence: true) {
                        stage('Deploy to DEV') {
                                ansible.runInstallPlaybook(version, 'dev');
                                ansibleCommitId = ansible.runDeployPlaybook(version, 'dev')
                                rpmTagger.tagDeploymentSuccessfulOn('dev')
                                rpmTagger.tagAnsibleCommit(ansibleCommitId)
                            }
                        stage('Smoke Test (Dev)') {
                          echo 'to be implemented'
                        }
                    }
                    milestone()
                }

            }   catch (err) {
                notifyBuildFailure channel: channel
                throw err
            }
        }
        milestone()
    }
    notifyBuildFixed channel: channel
}
