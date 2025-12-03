// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://jewellery-gules-one.vercel.app/",
      changeOrigin: true,
      secure: true,
      // logLevel: "debug", // uncomment to see proxy logs in terminal
    })
  );
};
