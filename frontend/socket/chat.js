import { getSocket } from "./socket";

export const emitSentMessage = (payload) => {
  console.log(payload, "payload");
  getSocket().emit("sent-message", payload);
};

export const onSentMessage = (payload) => {
  console.log(
    payload,
    "onSentMessage***********************************************"
  );
  // let state = getStore().getState();
  // let currentUser = state.user.current;
  // getStore().dispatch({
  //   type: constants.SOCKET_SENT_MESSAGE,
  //   payload: { message: payload, currentUser: currentUser },
  // });
};
