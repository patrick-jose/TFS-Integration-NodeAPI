const vstsURL = process.env.TFS_URL;
const vstsProject = process.env.TFS_PROJECT;
const pullRequestEnum = require('../enums/pull-request.enum');


module.exports.pullRequest = (pullRequest) => {
    // pullRequest.closedDate can be null
    if (pullRequest.closedDate != null)
        pullRequest.closedDate = pullRequest.closedDate.toISOString().replace(/T/, ' ').replace(/\..+/, '')

    let pullRequestTemplate = {
        id: pullRequest.pullRequestId,
        title: pullRequest.title,
        description: pullRequest.description,
        url: `${vstsURL}/${vstsProject}/_git/${pullRequest.repository.name}/pullrequest/${pullRequest.pullRequestId}`,
        creationDate: pullRequest.creationDate.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        closedDate: pullRequest.closedDate,
        status: pullRequestEnum.pullRequestStatusEnum[pullRequest.status],
        createdBy: pullRequest.createdBy,
        codeReviewId: pullRequest.codeReviewId,
        repository: {
            id: pullRequest.repository.id,
            name: pullRequest.repository.name,
            url: pullRequest.repository.url
        },
        sourceRefName: pullRequest.sourceRefName,
        targetRefName: pullRequest.targetRefName,
        mergeStatus: pullRequestEnum.pullRequestMergeStatusEnum[pullRequest.mergeStatus],
        reviewers: pullRequest.reviewers,
    };
    return pullRequestTemplate;
}

module.exports.pullRequestDataChart = (pullRequest) => {
    
    let pullRequestDataChartTemplate = {
        creationDate: pullRequest.creationDate,
        closedDate: pullRequest.closedDate
    }

    return pullRequestDataChartTemplate;
}
