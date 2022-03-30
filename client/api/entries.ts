import axiosClient from './axiosClient';

const entriesRoute = '/api/entries/';

type Data = {
  category: string;
  income: boolean;
  amount: number;
};

export async function getEntries() {
  return axiosClient.get(entriesRoute);
}

export async function postEntries(data: Data) {
  return axiosClient.post(entriesRoute, data);
}

export async function putEntries(id: string, data: Data) {
  return axiosClient.put(`${entriesRoute}${id}`, data);
}

export async function deleteEntries(id: string) {
  return axiosClient.delete(`${entriesRoute}${id}`);
}
