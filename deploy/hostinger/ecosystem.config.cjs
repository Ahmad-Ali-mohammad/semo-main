module.exports = {
  apps: [
    {
      name: 'semo-api',
      cwd: '/var/www/semo-main/server',
      script: 'index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/var/log/semo-api-error.log',
      out_file: '/var/log/semo-api-out.log',
      time: true,
    },
  ],
};
