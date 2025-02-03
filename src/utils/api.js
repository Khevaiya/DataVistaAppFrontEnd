import axios from 'axios';

const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;
console.log(import.meta.env);
export const apiCall = async (endpoint, method = 'GET', data = null, headers = {}) => {
  try {
    const response = await axios({
      url: `${API_BASE_URL}${endpoint}`,
      method,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
