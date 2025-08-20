import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const searchPlants = (query: string) => API.get(`/search?q=${query}`);

export const uploadPlantImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const diseaseUpload = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/disease_upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getQuiz = () => API.get('/quiz');
export const submitQuiz = (id: number, selected: number) => API.post('/quiz_submit', { id, selected });
export const getDiseaseTreatment = (input: string) => API.post('/disease_treatment', { input });
