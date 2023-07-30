const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    message: "your requested url is not found",
  });
};

module.exports = handler;
