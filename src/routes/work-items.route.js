const express = require('express');
const router = express.Router();
const workItemsController = require('../controllers/work-items.controller');


/**
 * Get informations about a WorkItem by ID
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.get('/:id', async(req, resp, next) => {
    try {
        let workItemList;

        if (req.query.extended == 'all') {
            workItemList = await workItemsController.getWorkItemByIdExtended(req.params.id); 
        } else {
            workItemList = await workItemsController.getWorkItemById(req.params.id);
        }
        resp.send(workItemList);
    } catch (error) {
        next(error);
    }
});


/**
 * Get informations about WorkItem relations
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.get('/:id/relations', async(req, resp, next) => {
    try {
        let workItemList = await workItemsController.getWorkItemByIdExtended(req.params.id); 
        resp.send(workItemList.relations);
    } catch (error) {
        next(error);
    }
});


/**
 * Get informations about WorkItem links
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.get('/:id/_links', async(req, resp, next) => {
    try {
        let workItemList = await workItemsController.getWorkItemByIdExtended(req.params.id); 
        resp.send(workItemList._links);
    } catch (error) {
        next(error);
    }
});


/**
 * Post Pull Request status related with a WorkItem
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.post('/updatePullRequestStatus', async(req, resp, next) => {
    try {
        let comment = `${req.body.message.markdown}`;
        let closedDate = req.body.resource.fields['Microsoft.VSTS.Common.ClosedDate']['newValue'];

        if (closedDate) {
            comment = `${comment} on **${closedDate.replace(/T/, ' ').replace(/\..+/, '')}**\n\r\n\r&#128540;`;
        } else {
            comment = `${comment}\n\r\n\r&#128526;`;
        }

        let result = await workItemsController.updatePullRequestStatus(comment, req.body.resource.workItemId);
        resp.send(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
