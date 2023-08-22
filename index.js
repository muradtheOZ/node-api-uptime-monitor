const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const data = require("./lib/data");

// app object scaffolding
const app = {};

data.read("test", "newFile", (err, data) => {
  console.log("data is", data, err);
});

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Server is on port ${environment.port}`);
  });
};

app.handleReqRes = handleReqRes;
app.createServer();
