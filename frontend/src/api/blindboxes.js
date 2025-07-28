import api from './index';

export const getBlindBoxes = () => api.get('blindboxes');
export const getBlindBoxById = (id) => api.get(`blindboxes/${id}`);
export const drawBlindBox = (id) => api.post(`blindboxes/${id}/draw`);