const express = require('express');
const router = express.Router();
const { version, repository, description } = require('../../package.json');


/**
 * Get informations about API
 *
 * @param  {Request} req
 * @param  {Response} resp
 */
router.get('/', async(req, resp) => {
    resp.send({
        service: 'TFS Integration NodeAPI',
        version,
        description,
        repository: repository.url,
        metadata: {
            remoteAddress: [...req.ips, req.connection.remoteAddress]
        }
    });
});

module.exports = router;
