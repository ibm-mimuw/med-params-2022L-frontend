const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3001; // Choose a port number that is different from your React app

// Configure the proxy middleware
app.use(
  '/api',
  createProxyMiddleware({
    target: '/rest/person/', // Replace with the target API URL
    changeOrigin: true,
    secure: false, // Set to 'false' if the target API doesn't use HTTPS
    pathRewrite: {
      '^/api': '', // Remove the '/api' prefix from the request path
    },
  })
);

// Start the proxy server
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
