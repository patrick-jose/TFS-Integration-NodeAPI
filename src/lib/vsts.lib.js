const vsts = require('azure-devops-node-api');
const vstsCollectionURL = process.env.TFS_URL;
const vstsAPIToken = process.env.TFS_USER_TOKEN;

let vstsAuthHandler = vsts.getPersonalAccessTokenHandler(vstsAPIToken);
let vstsConnection = new vsts.WebApi(vstsCollectionURL, vstsAuthHandler);

module.exports.vstsGit = async () => {
    try {
        let vstsGit = await vstsConnection.getGitApi();
        return vstsGit;
    } catch (error) {
        console.log(error);
    }
}

module.exports.vstsWorkItem = async () => {
    try {
        let vstsWorkItem = await vstsConnection.getWorkItemTrackingApi();
        return vstsWorkItem;
    } catch (error) {
        console.log(error);
    }
}
