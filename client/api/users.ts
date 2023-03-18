import axiosClient from './axiosClient';

const usersRoute = '/api/users';

type Data = {
  name?: string;
  email?: string;
  password?: string;
};

export async function getUser() {
  return axiosClient.get(usersRoute);
}

export async function registerUser(data: Data) {
  const res = await axiosClient.post(`${usersRoute}/register`, data);
  return res;
}

export async function loginUser(data: Data) {
  const res = await axiosClient.post(`${usersRoute}/login`, data);
  localStorage.setItem('x-auth-token', res.data.result);
}

export async function putUser(data: Data) {
  const res = await axiosClient.put(usersRoute, data);
  return res;
}

export async function deleteUser() {
  return axiosClient.delete(usersRoute);
}
