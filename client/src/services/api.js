import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

API.interceptors.request.use(async req => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) req.headers.Authorization = `Bearer ${session.access_token}`;
  return req;
});

export const logUsage = (data) => API.post('/usage', data);
export const getUsage = ()     => API.get('/usage');
export const setGoal  = (data) => API.post('/goals', data);
export const getGoals = ()     => API.get('/goals');