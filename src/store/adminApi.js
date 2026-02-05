import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://your-api-url', // replace with your API base URL
});

export const setAuthToken = (token) => {
  if (token) {
    adminApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete adminApi.defaults.headers.common['Authorization'];
  }
};

export default adminApi;