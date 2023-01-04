const { emitNotifyToArray } = require("../helper");

let sentMessage = (io, data, clients, user) => {
  console.log(data, "sentMessage data");
  if (data.conversationType === "ChatGroup") {
    data.members.forEach((item) => {
      if (clients[item]) {
        emitNotifyToArray(clients, item, io, "res-sent-message", data);
      }
    });
  } else if (data.conversationType === "User") {
    if (clients[data.receiver]) {
      emitNotifyToArray(clients, data.receiver, io, "res-sent-message", data);
    }
    if (clients[data.sender]) {
      emitNotifyToArray(clients, data.sender, io, "res-sent-message", data);
    }
  }
};
module.exports = sentMessage;
