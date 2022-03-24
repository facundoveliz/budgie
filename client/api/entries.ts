import axiosClient from './axiosClient';

const entriesRoute = '/api/entries/';

type Data = {
  category: string,
  income: boolean,
  amount: number,
  user: string,
};

export function getEntries() {
  return axiosClient.get(entriesRoute)
    .catch(err => {
      if (err.response) {
        console.log(err.response);
      } else {
        console.log('err', err.message);
      }
    });
}

export function postEntries(data: Data) {
  return axiosClient.post(entriesRoute, data);
}

export function putEntries(id: string) {
  return axiosClient.post(`entriesRoute${id}`);
}

export function deleteEntries(id: string) {
  return axiosClient.delete(`entriesRoute${id}`);
}
