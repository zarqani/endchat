Promise = require("bluebird"); // eslint-disable-line no-global-assign
const server = require("./config/express");

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log("server is running on port " + port);
});

// (redis, pubsub)
// (redis, pubsub)
// (redis, pubsub)
// (redis, pubsub)
// (redis, pubsub)
