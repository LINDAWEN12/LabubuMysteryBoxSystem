import api from './index';

export const getShowcases = () => api.get('/showcases');
export const createShowcase = (data) => api.post('/showcases', data);
export const likeShowcase = (id) => api.post(`/showcases/${id}/like`);