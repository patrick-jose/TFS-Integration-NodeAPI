const express = require('express');
const router = express.Router();
const repositoryController = require('../controllers/repository.controller');


/**
 * Get informations about all repositories
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.get('/', async(req, resp, next) => {
    try {
        let repos = await repositoryController.getRepositories()
        resp.send(repos);
    } catch (error) {
        next(error);
    }
});


/**
 * Get informations about a specific repository by Id
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.get('/:id', async(req, resp, next) => {
    try {
        let repos = await repositoryController.getRepositoryById(req.params.id)
        resp.send(repos);
    } catch (error) {
        next(error);
    }
});


/**
 * Create a new tag in a respository
 *
 * @param  {Request} req
 * @param  {Response} resp
 * @param  {Next} next
 */
router.post('/:id/createTag', async(req, resp, next) => {
    try {
        let newTag = await repositoryController.createTag(req.params.id, req.body.name, req.body.objectId, req.body.message);
        resp.send(newTag);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
