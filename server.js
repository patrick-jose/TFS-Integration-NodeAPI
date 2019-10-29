const app = require('./src/app');
const { version } = require('./package.json');
const host = process.env.SERVER_HOST || localhost;
const port = process.env.SERVER_PORT || 3000;


const server = app.listen(port, () => {
    console.info(`
		\r -------------------------------------------------------------------
		\r TFS Integration Node API - ${version} - http://${host}:${port}
		\r -------------------------------------------------------------------

		\r => TFS Url: ${process.env.TFS_URL}
		\r => TFS Project: ${process.env.TFS_PROJECT}
	`);
});
