#!groovy

properties(
  [[$class: 'GithubProjectProperty', displayName: 'Submit Your Appeal frontend', projectUrlStr: 'https://github.com/hmcts/submit-your-appeal/'],
   pipelineTriggers([
     [$class: 'hudson.triggers.TimerTrigger', spec  : 'H 1 * * *']
   ])]
)

@Library('Reform')
import uk.gov.hmcts.Ansible
import uk.gov.hmcts.Packager
import uk.gov.hmcts.RPMTagger

Ansible ansible = new Ansible(this, 'sscs')
Packager packager = new Packager(this, 'sscs')

def channel = '#sscs-tech'


timestamps {
    milestone()
    lock(resource: "submit-your-appeal-frontend-${env.BRANCH_NAME}", inversePrecedence: true) {
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
                    sh 'make sonarscan-tactical'
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
                            step([$class: 'JUnitResultArchiver', testResults: env.JUNIT_REPORT_PATH])
                        }
                    }
                }

                stage('Package application (RPM)') {
                    syaFrontendRPMVersion = packager.nodeRPM('submit-your-appeal-frontend')
                    version = "{submit_your_appeal_frontend_version: ${syaFrontendRPMVersion}}"

                    onMaster {
                        packager.publishNodeRPM('submit-your-appeal-frontend')
                    }
                }

                //noinspection GroovyVariableNotAssigned It is guaranteed to be assigned
                RPMTagger rpmTagger = new RPMTagger(this,
                'submit-your-appeal-frontend',
                packager.rpmName('submit-your-appeal-frontend', syaFrontendRPMVersion),
                'sscs-local'
                )

                onMaster {
                    milestone()
                    lock(resource: "sscs-frontend-dev-deploy", inversePrecedence: true) {
                        stage('Deploy to DEV') {
                                ansibleCommitId = ansible.runDeployPlaybook(version, 'dev')
                                rpmTagger.tagDeploymentSuccessfulOn('dev')
                                rpmTagger.tagAnsibleCommit(ansibleCommitId)
                            }
                        stage('Smoke Test (Dev)') {
                            ws('workspace/sscsHealthCheck/build') {
                                git url: 'git@github.com:hmcts/submit-your-appeal.git'
                                sh 'make install-tactical'
                                sh 'make health-check-tactical'
                                deleteDir()
                            }
                        }
                    }
                    milestone()
                }

            }  catch (Throwable err) {
                notifyBuildFailure channel: channel
                throw err
            }
        }
    }
  notifyBuildFixed channel: channel
}
