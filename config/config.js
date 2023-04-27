/* eslint-disable no-console */

const env = process.env.NODE_ENV || process.env.npm_config_env || 'local';
const port = process.env.PORT || process.env.npm_config_port;

const options = Object.assign(require('./env/all.json'), require(`./env/${env}.json`));

try {
  console.log(`Using environment config <${env}.json>`);
} catch (e) {
  console.error('\nError: Environment config not found');
  process.exit();
}

/**
 * Get app settings based on environment
 * @return {JSON} App settings
 */
exports.getOptions = () => {
  if (port) options.app_server = Object.assign(options.app_server || {}, { port });

  return options;
};
