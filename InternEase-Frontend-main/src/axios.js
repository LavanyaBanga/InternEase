import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // .env se value lega
  withCredentials: true, // cookies/token bhejne ke liye
});

export default instance;
