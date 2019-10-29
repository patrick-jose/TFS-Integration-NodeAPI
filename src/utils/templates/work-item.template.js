const vstsURL = process.env.TFS_URL;
const vstsProject = process.env.TFS_PROJECT;


module.exports.workItemPullRequest = (workItem) => {
    let workItemTemplate = {
        id: workItem.id,
        tile: workItem.fields['System.Title'],
        type: workItem.fields['System.WorkItemType'],
        state: workItem.fields['System.State'],
        createdDate: workItem.fields['System.CreatedDate'].replace(/T/, ' ').replace(/\..+/, ''),
        assignedTo: workItem.fields['System.AssignedTo'],
    }

    if (workItem.fields['Microsoft.VSTS.Common.ResolvedDate']) {
        workItemTemplate.resolvedDate = workItem.fields['Microsoft.VSTS.Common.ResolvedDate'].replace(/T/, ' ').replace(/\..+/, '');
    }

    if (workItem.fields['Microsoft.VSTS.Common.ClosedDate']) {
        workItemTemplate.closedDate = workItem.fields['Microsoft.VSTS.Common.ClosedDate'].replace(/T/, ' ').replace(/\..+/, '');
    }

    workItemTemplate.closedBy = workItem.fields['Microsoft.VSTS.Common.ClosedBy'];
    workItemTemplate.qualityPhase = workItem.fields['Agile.Quality.Phase'];
    workItemTemplate.deploymentPhase = workItem.fields['Agile.Deployment.Phase'];
    workItemTemplate.url = `${vstsURL}${vstsProject}/_workitems?id=${workItem.id}`;

    return workItemTemplate;
}
