/* eslint-disable import/order */
/* eslint-disable no-console */

const path = require('path');
const express = require('express');
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const compression = require('compression');
const basicAuth = require('basic-auth-connect');
const serverConfig = require('./config/config').getOptions().app_server;
const webpack = serverConfig.isDev ? require('webpack') : null;
const webpackDevMiddleware = serverConfig.isDev ? require('webpack-dev-middleware') : null;
const webpackHotMiddleware = serverConfig.isDev ? require('webpack-hot-middleware') : null;
const webpackConfig = serverConfig.isDev ? require('./webpack.config.js') : null;
const chokidar = serverConfig.isDev ? require('chokidar') : null;
require('console-stamp')(console, { pattern: 'yyyy-mm-dd HH:MM:ss.l' });

const app = express();
const reqTimeout = serverConfig.request_timeout || 30000;

const errorHandler = (err, req, res, next) => {
    if (req.timedout) {
        const errorMsg = `Request timed out at ${reqTimeout / 1000} sec.`;
        console.log(`Error: ${errorMsg}`);
        if (!res.headersSent) res.status(500).send({ error: `${errorMsg}` });
    } else {
        console.log(err || 'Unknown error');
        next(err);
    }
};

/*
 * Server configuration
 */
app.use(timeout(reqTimeout));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());
app.use('/api', (req, res, next) => {
    // eslint-disable-next-line global-require
    require('./server/routes/apiRoutes')(req, res, next);
});
app.use(errorHandler);

if (serverConfig.auth_routes) {
    serverConfig.auth_routes.forEach((element) => {
        app.use(element, basicAuth(serverConfig.user, serverConfig.password));
    });

    app.get('/logout', (req, res) => {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    });
}

/*
 * Hook up webpack middleware in dev or serve static build
 */
if (serverConfig.isDev) {
    // dev
    const compiler = webpack(webpackConfig);
    const watcher = chokidar.watch('./server/**');
    const devMiddleware = webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });
    app.use(devMiddleware);
    app.use(
        webpackHotMiddleware(compiler, {
            log: false,
            path: '/__webpack_hmr',
            heartbeat: 10 * 1000
        })
    );
    app.get('*', (req, res) => {
        res.write(
            devMiddleware.context.compiler.outputFileSystem.readFileSync(path.resolve(__dirname, 'public/build/index.html'))
        );
        res.end();
    });
    // Enable hot-reloading of dev server files
    let serverStart = true;
    watcher.on('all', (e, filePath) => {
        console.log(`${filePath} ${e}`);
        if (serverStart) {
            serverStart = false;
            return;
        }
        let i = 0;
        Object.keys(require.cache).forEach((id) => {
            const pattern = '(server|config)/';
            const re = new RegExp(pattern);
            if (re.test(id)) {
                delete require.cache[id];
                i += 1;
            }
        });
        console.log(`${i} modules will load from the filesystem`);
    });
} else {
    // build
    app.use(express.static(path.join(__dirname, 'public/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/build/index.html'));
    });
}

/*
 * Run Express server
 */
app.listen(serverConfig.port, '0.0.0.0', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.info(`Listening on port ${serverConfig.port}`);
        if (serverConfig.isDev) console.info('Wait for webpack to finish bundling...');
    }
});
