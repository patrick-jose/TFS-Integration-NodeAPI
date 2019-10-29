const vsts = require('../lib/vsts.lib');
const pullRequestTemplate = require('../utils/templates/pull-request.template');
const workItemController = require('../controllers/work-items.controller');
const repositoryController = require('../controllers/repository.controller');
const gitInterfaces = require('azure-devops-node-api/interfaces/GitInterfaces');
const functions = require('../utils/functions/pullrequest.functions');
const vstsProject = process.env.TFS_PROJECT;
const searchCriteria = { status: gitInterfaces.PullRequestStatus.All }


/**
 * Controller get informations about Pull Request
 */
module.exports.getPullRequests = async() => {
    let vstsGit = await vsts.vstsGit();

    let pullRequests = await vstsGit.getPullRequestsByProject(vstsProject, searchCriteria, -1, -1, -1);

    let pullRequestList = pullRequests.map(
        pullRequest => pullRequestTemplate.pullRequest(pullRequest)
    );

    return pullRequestList;
}

/**
 * Controller get data to fill chart
 */
module.exports.getPullRequestDataChart = async() => {
    let vstsGit = await vsts.vstsGit();

    let pullRequestDataChart = await vstsGit.getPullRequestsByProject(vstsProject, searchCriteria, -1, -1, -1);

    let pullRequestDataChartList = pullRequestDataChart.map(
        pullRequestDataChart => pullRequestTemplate.pullRequestDataChart(pullRequestDataChart)
    );

    let List = [];
    
    for (let index = 0; index < pullRequestDataChartList.length; index++) {
        List[index] = {
            x: functions.formataStringData(pullRequestDataChartList[index]['creationDate']),
            y: functions.calcQuantityPRsByDay(pullRequestDataChartList, pullRequestDataChartList[index]['creationDate'], index),          
        }
        // Removing repeated data
        if (List[index - 1] != undefined && List[index]['x'] == List[index - 1]['x'])
            List.splice(index - 1); 
    }

    List = List.filter(function (element) {
        return element != null;
    });

    pullRequestDataChartList = List;

    return pullRequestDataChartList;
}

/**
 * Controller get date to fill datachart by repository
 */
module.exports.getPullRequestByRepoDataChart = async(repoId) => {
    let vstsGit = await vsts.vstsGit();

    let pullRequestByRepoDataChart = await vstsGit.getPullRequests(repoId, searchCriteria, vstsProject, -1, -1, -1);

    let pullRequestByRepoDataChartList = pullRequestByRepoDataChart.map(
        pullRequestByRepoDataChart => pullRequestTemplate.pullRequestDataChart(pullRequestByRepoDataChart)
    );

    let List = [];
    
    for (let index = 0; index < pullRequestByRepoDataChartList.length; index++) {
        List[index] = {
            x: functions.formataStringData(pullRequestByRepoDataChartList[index]['creationDate']),
            y: functions.calcQuantityPRsByDay(pullRequestByRepoDataChartList, pullRequestByRepoDataChartList[index]['creationDate'], index),          
        }
        // Removing repeated data
        if (List[index - 1] != undefined && List[index]['x'] == List[index - 1]['x'])
            List.splice(index - 1); 
    }

    List = List.filter(function (element) {
        return element != null;
    });

    pullRequestByRepoDataChartList = List;

    return pullRequestByRepoDataChartList;
}


/**
 * Controller get informations about Pull Request
 * 
 * @param  {RepoID} repoId
 */
module.exports.getPullRequestsByRepositoryId = async(repoId) => {
    let vstsGit = await vsts.vstsGit();

    let pullRequests = await vstsGit.getPullRequests(repoId, searchCriteria, vstsProject, -1, -1, -1);

    let pullRequestList = pullRequests.map(
        pullRequest => pullRequestTemplate.pullRequest(pullRequest)
    );

    return pullRequestList;
}


/**
 * Controller get informations about Pull Request
 *
 * @param  {PullRequestID} id
 */
module.exports.getPullRequestById = async(id) => {
    let vstsGit = await vsts.vstsGit();

    let pullRequest = await vstsGit.getPullRequestById(id);
    let workItemRefs = await vstsGit.getPullRequestWorkItemRefs(pullRequest.repository.id, id);
    let pullRequestList = pullRequestTemplate.pullRequest(pullRequest);

    let promises = workItemRefs.map(
        workitem => workItemController.getWorkItemById(workitem.id)
    );

    let workItems = await Promise.all(promises);

    pullRequestList.workItems = workItems;
    return pullRequestList;
}


/**
 * Controller get informations about Pull Request
 *
 * @param  {PullRequestID} id
 */
module.exports.getWorkItemsByPullRequest = async(id) => {
    let vstsGit = await vsts.vstsGit();

    let pullRequest = await vstsGit.getPullRequestById(id);
    let workItemRefs = await vstsGit.getPullRequestWorkItemRefs(pullRequest.repository.id, id);

    let promises = workItemRefs.map(
        workitem => workItemController.getWorkItemById(workitem.id)
    );

    let workItemsList = await Promise.all(promises);
    
    return workItemsList;
}


/**
 * Controller to create thread into a Pull Request
 *
 * @param  {PullRequestID} id
 */
module.exports.addComment = async(comment, id) => {
    let vstsGit = await vsts.vstsGit();
    let pullRequest = await this.getPullRequestById(id);
    let repoId = pullRequest.repository.id;

    let thread = {
        status: gitInterfaces.CommentThreadStatus.Closed,
        comments: [{ content: comment }]
    }

    await vstsGit.createThread(thread, repoId, id);
}


/**
 * Controller to adds new status into a Pull Request
 *
 * @param  {PullRequestID} id
 */
module.exports.createPullRequestStatus = async(id) => {
    let vstsGit = await vsts.vstsGit();

    let pullRequest = await this.getPullRequestById(id);
    let repoId = pullRequest.repository.id;

    if (pullRequest.status == "active") {
        let prStatus = {
            "state": "succeeded",
            "description": "All related work items are closed :)",
            "targetUrl": "http://visualstudio.microsoft.com",
            "context": {
                "name": "workitems-state-checker",
                "genre": "workflow"
            }
        };

        let workItems = await this.getWorkItemsByPullRequest(id);

        if (workItems.length == 0) {
            prStatus.state = "notApplicable";
            prStatus.description = "No related work items";
        } else {
            for (let index = 0; index < workItems.length; index++) {
                const workitem = workItems[index];
                if (((workitem.type == 'User Story') || (workitem.type == 'Feature')) && (workitem.state != 'Closed')) {
                    prStatus.state = "pending";
                    prStatus.description = "Work items not closed...";
                    prStatus.targetUrl = "http://visualstudio.microsoft.com";
                    break;
                }
            }
        }

        let pullRequestStatusResult = await vstsGit.createPullRequestStatus(prStatus, repoId, id);
        return pullRequestStatusResult;
    }
}


/**
 * Controller to create a new tag in a repository after pull request merge
 */
module.exports.createTagAfterPullRequestMerge = async(id, tagName, objectId, tagMessage, repoId, comment, taggedBy) => {
    let newTag = await repositoryController.createTag(repoId, tagName, objectId, tagMessage, taggedBy);
    await this.addComment(`${comment}- **Created tag:** [${tagName}](${newTag.url})`, id);
    return newTag;
}
