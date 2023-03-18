import axiosClient from './axiosClient';

const entriesRoute = '/api/entries/';

type Data = {
  category: string;
  type: boolean;
  amount: number;
};

type Entry = {
  id: string;
  data: Data;
};

export async function getEntries() {
  return axiosClient.get(entriesRoute);
}

export async function postEntries(data: Data) {
  return axiosClient.post(entriesRoute, data);
}

export async function putEntries(entry: Entry) {
  return axiosClient.put(`${entriesRoute}${entry.id}`, entry.data);
}

export async function deleteEntries(id: string) {
  return axiosClient.delete(`${entriesRoute}${id}`);
}
