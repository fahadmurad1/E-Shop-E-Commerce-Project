import axios from 'axios';

// In production (Vercel), VITE_API_URL will be set to the Render backend URL.
// In development, it's empty so Vite proxy handles /api/* → localhost:5000
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export default instance;
