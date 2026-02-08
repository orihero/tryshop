import axios from 'axios';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const appwriteAxios = axios.create({
  baseURL: endpoint,
  headers: {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': projectId ?? '',
  },
  withCredentials: true,
});
