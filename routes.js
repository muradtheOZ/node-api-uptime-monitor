// depndencies

const { homeHandler } = require("./handlers/routeHandlers/home");
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHanlder } = require("./handlers/routeHandlers/userHandler");
const {tokenHandler} = require("./handlers/routeHandlers/tokenHandler");

const routes = {
  "": homeHandler,
  sample: sampleHandler,
  user: userHanlder,
  token: tokenHandler,
};

module.exports = routes;
