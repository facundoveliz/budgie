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
  if (res === 'Invalid email or password') {
    return res;
  }
  return (window.location.href = '/login');
}

export async function loginUser(data: Data) {
  const res = await axiosClient.post(`${usersRoute}/login`, data);
  if (res === 'Invalid email or password') {
    return res;
  }
  localStorage.setItem('x-auth-token', res.data.result);
  return (window.location.href = '/');
}

export async function putUser(data: Data) {
  const res = await axiosClient.put(usersRoute, data);
  if (res === 'Invalid email or password') {
    return res;
  }
}

export async function deleteUser() {
  return axiosClient.delete(usersRoute);
}
