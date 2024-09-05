module.exports = {
  apps: [
    {
      name: 'app',
      script: 'app.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'app2',
      script: 'app.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'app3',
      script: 'app.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },
    {
      name: 'app4',
      script: 'app.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
    },
  ],
};
