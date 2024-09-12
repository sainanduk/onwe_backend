const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

// Repository path
const repoPath = '/home/ubuntu/onwe_backend';

// Optional: Secret for extra security
const DEPLOY_SECRET = 'backendnandu'; // Set this to a secure value

router.post('/deploy', (req, res) => {
  const { secret } = req.headers;

  // Validate the secret
  if (secret !== DEPLOY_SECRET) {
    return res.status(403).send('Unauthorized');
  }

  console.log('Received deploy request');

  // Pull the latest changes from GitHub
  exec(`cd ${repoPath} && git pull origin main`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error pulling latest changes: ${err}`);
      return res.status(500).send('Failed to pull latest changes');
    }
    console.log(`Pull output: ${stdout}`);
    console.error(`Pull errors: ${stderr}`);

    // Install npm dependencies
    exec(`cd ${repoPath} && npm install`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error installing npm dependencies: ${err}`);
        return res.status(500).send('Failed to install npm dependencies');
      }
      console.log(`NPM install output: ${stdout}`);
      console.error(`NPM install errors: ${stderr}`);

      // Restart the server using PM2
      exec('pm2 restart all', (err, stdout, stderr) => {
        if (err) {
          console.error(`Error restarting server: ${err}`);
          return res.status(500).send('Failed to restart server');
        }
        console.log(`Restart output: ${stdout}`);
        console.error(`Restart errors: ${stderr}`);
        res.status(200).send('Deployment successful');
      });
    });
  });
});

module.exports = router;
