const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");

// app object scaffolding
const app = {};

//configuration
app.config = {
  port: 3000,
};

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Server is on port ${app.config.port}`);
  });
};

app.handleReqRes = handleReqRes;
app.createServer();
