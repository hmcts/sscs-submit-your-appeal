#!groovy
properties(
        [[$class: 'GithubProjectProperty', projectUrlStr: 'https://github.com/hmcts/submit-your-appeal'],
         pipelineTriggers([[$class: 'GitHubPushTrigger']])]
)

@Library("Infrastructure")

def product = "sscs-tribunals"
def component = "frontend"

withPipeline("nodejs", product, component) {

}
