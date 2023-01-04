const socketioJwt = require("socketio-jwt");
const { jwtSecret } = require("../../config/vars");
const sentMessage = require("./chat/sentMessage");

const getUserInfo = require("./getUserInfo");
const {
  pushSocketIdToArray,
  emitNotifyToArray,
  removeSocketIdToArray,
} = require("./helper");

let initSockets = (io) => {
  // io.use(
  //   socketioJwt.authorize({
  //     secret: jwtSecret,
  //     handshake: true,
  //   })
  // );
  let clients = {};
  io.on("connection", async (socket) => {
    try {
      // const user = await getUserInfo(socket.decoded_token.id);

      // if (user) {
      //   clients = pushSocketIdToArray(clients, user.id, socket.id);
      // }

      // // handle disconnect
      // socket.on("disconnect", () => {
      //   clients = removeSocketIdToArray(clients, user.id, socket);
      // });

      socket.on("sent-message", (data) => {
        console.log(
          data,
          "jjjjjj**************************************************************************************************************************************************************"
        );
        // sentMessage(io, data, clients, user);
      });
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = initSockets;
