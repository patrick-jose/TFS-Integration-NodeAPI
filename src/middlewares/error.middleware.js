/**
 * Default response for non-existent routes
 *
 * @param  {Request} req
 * @param  {Response} resp
 */
exports.notFound = (req, resp, next) => {
    resp.send({
        message: 'Resource not implemented',
        metadata: {
            remoteAddress: [...req.ips, req.connection.remoteAddress]
        }
    });
}


/**
 * Default resp for server error
 *
 * @param  {Request} req
 * @param  {Response} resp
 */
exports.serverError = (error, req, resp, next) => {
    resp.status(500);
    resp.send({
        message: error.message,
        metadata: {
            remoteAddress: [...req.ips, req.connection.remoteAddress]
        }
    });
}
