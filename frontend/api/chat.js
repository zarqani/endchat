import { emitSentMessage } from "socket/socket";
import api from "./api";

export const getAllChatgroup = async () => {
  const response = await api.get("/chatgroup");
  return response;
};

export const getGroupMessages = async (id) => {
  const response = await api.get(`/message/group/${id}`);
  return response;
};

export const addMessage = async (data) => {
  const response = await api.post("/message", { ...data });
  const users = await api.get("user/all");

  let members = [];
  if (users?.data?.length > 0) members = users.data.map((item) => item.id);

  if (response?.data) emitSentMessage({ ...response.data, members });
  return response;
};

// const services = {
//   // listFn: async ({ term }) => {
//   //     let url = "/user";
//   //     url = term ? url + `?term=${term}` : url;
//   //     const response = await api.get(url);
//   //     return response;
//   // },
//   getListFn: async ({ gskip = 0, pskip = 0 }) => {
//     const response = await api.get(`/message?gskip=${gskip}&pskip=${pskip}`);
//     return response;
//   },

//   findFn: async (id, skip, limit) => {
//     const response = await api.get(
//       `/message/${id}?skip=${skip}&limit=${limit}`
//     );
//     return response;
//   },

//   createFn: async (info) => {
//     const response = await api.post(`/message`, info);
//     return response;
//   },

//   updateFn: async (id, message) => {
//     const response = await api.patch(`/message?user=${id}`, message);
//     return response;
//   },

//   destroyFn: async (id) => {
//     const response = await api.delete(`/message?user=${id}`);
//     return response;
//   },

//   listImageFn: async ({ id, skip = 0, limit = 9 }) => {
//     const response = await api.get(
//       `/message/images?id=${id}&skip=${skip}&limit=${limit}`
//     );
//     return response;
//   },

//   listFileFn: async ({ id, skip = 0, limit = 9 }) => {
//     const response = await api.get(
//       `/message/files?id=${id}&skip=${skip}&limit=${limit}`
//     );
//     return response;
//   },
//   createGroupFn: async (info) => {
//     const response = await api.post(`/chat-group`, info);
//     return response;
//   },

//   updateChatGroupFn: async (info) => {
//     const response = await api.patch(`/chat-group`, info);
//     return response;
//   },

//   removeMember: async ({ groupId, userId }) => {
//     const response = await api.delete(
//       `/chat-group/member?group=${groupId}&user=${userId}`
//     );
//     return response;
//   },

//   addMembers: async (data) => {
//     const response = await api.patch(`/chat-group/member`, data);
//     return response;
//   },
// };

// export default services;
