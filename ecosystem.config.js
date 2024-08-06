module.exports = {
    apps: [
      {
        name: 'app',
        script: 'app.js',
        instances: 4,
        exec_mode: 'cluster',
        env: {
          PORT: 3000
        },
        env_2: {
          PORT: 3001
        },
        env_3: {
          PORT: 3002
        },
        env_4: {
          PORT: 3003
        }
      }
    ]
  };
  