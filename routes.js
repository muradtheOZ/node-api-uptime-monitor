// depndencies

const { homeHandler } = require("./handlers/routeHandlers/home");
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");

const routes = {
  "": homeHandler,
  sample: sampleHandler,
};

module.exports = routes;
