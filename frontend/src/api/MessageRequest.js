import axios from "axios"

const API = axios.create({baseURL: 'http://localhost:5000'});

export const getMessages = (id) => API.get(`/message/${id}`);
export const addMessage = (data) => API.post('/message/', data);
export const updateReadStatus = (msg_id) => API.patch(`/message/read/${msg_id}`, {read: true});