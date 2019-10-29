const express = require('express');
const router = express.Router();
const pullRequestController = require('../controllers/pull-request.controller');


/**
 * Get informations about a PullRequests
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.get('/', async(req, resp, next) => {
    try {
        let pullRequestList = await pullRequestController.getPullRequests();
        resp.send(pullRequestList);
    } catch (error) {
        next(error);
    }
});

/**
 * Get data to fill PullRequest's Chart
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.get('/getPullRequestDataChart', async(req, resp, next) => {
    try {
        let pullRequestDataChartList = await pullRequestController.getPullRequestDataChart();
        resp.send(pullRequestDataChartList);
    } catch (error) {
        next(error);
    }
});

/**
 * Get data to fill PullRequest's Chart by repository
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.get('/getPullRequestByRepoDataChart/:repoId', async(req, resp, next) => {
    try {
        let pullRequestByRepoList = await pullRequestController.getPullRequestByRepoDataChart(req.params.repoId);
        resp.send(pullRequestByRepoList);
    } catch (error) {
        next(error);
    }
});


/**
 * Get informations about a PullRequests by Repository
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.get('/repo/:repoId', async(req, resp, next) => {
    try {
        let pullRequestList = await pullRequestController.getPullRequestsByRepositoryId(req.params.repoId);
        resp.send(pullRequestList);
    } catch (error) {
        next(error);
    }
});


/**
 * Get informations about a PullRequest by ID
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.get('/:id', async(req, resp, next) => {
    try {
        let pullRequest = await pullRequestController.getPullRequestById(req.params.id);
        resp.send(pullRequest);
    } catch (error) {
        next(error);
    }
});


/**
 * Get workitems list by PullRequest 
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.get('/:id/workitems', async(req, resp, next) => {
    try {
        let workItemsByPullRequest = await pullRequestController.getWorkItemsByPullRequest(req.params.id);
        resp.send(workItemsByPullRequest);
    } catch (error) {
        next(error);
    }
});


/**
 * Create new Pull Request status
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.post('/createPullRequestStatus', async(req, resp, next) => {
    try {
        let pullRequestStatus = await pullRequestController.createPullRequestStatus(req.body.resource.pullRequestId);
        resp.send(pullRequestStatus);
    } catch (error) {
        next(error);
    }
});


/**
 * Create new tag after pull request merge
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.post('/createTagAfterMerge', async(req, resp, next) => {
    try {
        if (req.body.resource.status === 'completed') {
            let tagName = `v${req.body.resource.sourceRefName.split("/").pop(-1)}`;
            let objectId = req.body.resource.lastMergeCommit.commitId;
            let tagMessage = req.body.resource.title;
            let repoId = req.body.resource.repository.id;
            let pullRequestId = req.body.resource.pullRequestId;

            let comment = `${req.body.message.markdown} and merged this into branch *${req.body.resource.targetRefName}*.\r\n\r\n
                            \n- **Merge status:** Succeeded
                            \n- **Merge date:** ${req.body.resource.closedDate}
                            \n- **Merge commit:** [${objectId}](${req.body.resource.repository.remoteUrl}/commit/${objectId})\n`;

            let newTag = await pullRequestController.createTagAfterPullRequestMerge(pullRequestId, tagName, objectId, tagMessage, repoId, comment);
            resp.send(newTag);
        } else {
            resp.status(202);
            resp.send('Pull request state is not completed');
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
