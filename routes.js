// depndencies

const { homeHandler } = require("./handlers/routeHandlers/home");
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHanlder } = require("./handlers/routeHandlers/userHandler");

const routes = {
  "": homeHandler,
  sample: sampleHandler,
  user: userHanlder,
};

module.exports = routes;
