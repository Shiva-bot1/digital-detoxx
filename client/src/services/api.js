import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

API.interceptors.request.use(req => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);
export const logUsage     = (data) => API.post('/usage', data);
export const getUsage     = ()     => API.get('/usage');
export const setGoal      = (data) => API.post('/goals', data);
export const getGoals     = ()     => API.get('/goals');