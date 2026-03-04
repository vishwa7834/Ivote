import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || "";

// Add Localtunnel bypass header to all requests
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';
