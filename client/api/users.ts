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
  if (res) {
    return (window.location.href = '/login');
  }
}

export async function loginUser(data: Data) {
  const res = await axiosClient.post(`${usersRoute}/login`, data);
  if (res) {
    localStorage.setItem('x-auth-token', res.data.result);
    window.location.href = '/';
  }
}

export async function putUser(data: Data) {
  return axiosClient.put(usersRoute, data);
}

export async function deleteUser() {
  return axiosClient.delete(usersRoute);
}
