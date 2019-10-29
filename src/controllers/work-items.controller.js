const vsts = require('../lib/vsts.lib');
const workItemInterface = require('azure-devops-node-api/interfaces/WorkItemTrackingInterfaces')
const workItemTemplate = require('../utils/templates/work-item.template');
const pullRequestController = require('../controllers/pull-request.controller');


/**
 * Controller to get informations about a Work Item
 * 
 * @param  {WorkItem ID} id
 */
module.exports.getWorkItemById = async(id) => {
    let vstsWorkItem = await vsts.vstsWorkItem();
    let workItem = await vstsWorkItem.getWorkItem(id,undefined,undefined,workItemInterface.WorkItemExpand.Relations);
    let workItemList = workItemTemplate.workItemPullRequest(workItem);
    return workItemList;
}


/**
 * Controller to get all informations about a Work Item
 * 
 * @param  {WorkItem ID} id
 */
module.exports.getWorkItemByIdExtended = async(id) => {
    let vstsWorkItem = await vsts.vstsWorkItem();
    let workItem = await vstsWorkItem.getWorkItem(id,undefined,undefined,workItemInterface.WorkItemExpand.All);
    return workItem; 
}


/**
 * Controller to update a PullRequest related work item
 * 
 * @param  {WorkItem ID} id
 */
module.exports.updatePullRequestStatus = async(comment, id) => {
    let pullRequestStatusList = [];
    let workItemList = await this.getWorkItemByIdExtended(id);

    for (let index = 0; index < workItemList.relations.length; index++) {
        const workitem = workItemList.relations[index];

        if (workitem.attributes.name == 'Pull Request') {
            let pullRequestId = workitem.url.toLowerCase().split('%2f').pop();

            if (await pullRequestController.createPullRequestStatus(pullRequestId)) {
                pullRequestStatusList.push({ pullRequestId: pullRequestId, status: 'updated' });
                pullRequestController.addComment(comment, pullRequestId);
            } else {
                pullRequestStatusList.push({ pullRequestId: pullRequestId, status: 'faild' });
            }
        }
    }

    return pullRequestStatusList;
}
