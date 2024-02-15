module.exports = {
    apps: [
      {
        name: 'bank',
        script: 'app.js', // Update with your main application file
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
          PORT: 4500, // Update with your desired port
        },
      },
    ],
  };
  