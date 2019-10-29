const vsts = require('../lib/vsts.lib');
const vstsProject = process.env.TFS_PROJECT;
const functions = require('../utils/functions/pullrequest.functions');


/**
 * Controller get informations about all repositories
 */
module.exports.getRepositories = async() => {
    let vstsGit = await vsts.vstsGit();
    let repositories = await vstsGit.getRepositories(vstsProject);

    return functions.orderList(repositories);
}


/**
 * Controller get informations about a specific repository
 */
module.exports.getRepositoryById = async(id) => {
    let vstsGit = await vsts.vstsGit();
    let repository = await vstsGit.getRepository(id, vstsProject);

    return repository;
}


/**
 * Controller to create a new tag in a repository
 */
module.exports.createTag = async(id, tagName, objectId, message) => {
    let vstsGit = await vsts.vstsGit();

    let tagObject = {
        name: tagName,
        taggedObject: {
            objectId
        },
        message
    };

    let newTag = await vstsGit.createAnnotatedTag(tagObject, vstsProject, id);
    return newTag;
}
