module.exports = {
  apps: [
    {
      name: 'autovoz-stage-api',
      script: 'node',
      args: '-r dotenv/config . dotenv_config_path=./.env.stage ./dist/server.js',
    },
    {
      name: 'autovoz-api',
      script: 'node',
      args: '-r dotenv/config . dotenv_config_path=./.env.production ./dist/server.js',
    },
  ],
};
