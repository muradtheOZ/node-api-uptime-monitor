const handler = {};

handler.homeHandler = (requestProperties, callback) => {
  callback(200, {
    message: "This is a Home url",
  });
};

module.exports = handler;
