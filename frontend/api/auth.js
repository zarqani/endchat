import { configSocket } from "socket/socket";
import api from "./api";

export const fetchSignin = async ({ email, password }) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  if (response?.data?.token) configSocket(response.data.token);
  return response;
};

export const fetchSignup = async ({ firstname, lastname, email, password }) => {
  const response = await api.post("/auth/register", {
    firstname,
    lastname,
    email,
    password,
  });
  return response;
};

export const getCurrentUser = async (header) => {
  const response = await api.get("/user/current", header);
  return response;
};
