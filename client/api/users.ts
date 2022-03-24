import axiosClient from './axiosClient';

const usersRoute = '/api/users';

type Data = {
  name?: string,
  email: string,
  password: string,
};

// TODO: error handling for this and entries
export function getUser() {
  return axiosClient.get(usersRoute);
}

export function registerUser(data: Data) {
  return axiosClient.post(`${usersRoute}/register`, data)
    .then(res => {
      console.log(res);
    }).catch(err => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('err', err.message);
      }
    });
}

export function loginUser(data: Data) {
  return axiosClient.post(`${usersRoute}/login`, data)
    .then(res => {
      localStorage.setItem('x-auth-token', res.data.result);
    }).catch(err => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('err', err.message);
      }
    });
}
