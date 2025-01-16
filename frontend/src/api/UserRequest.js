import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

// Function to add a new user (Signup)
export const addUser = (username, email, password) => 
  API.post('/user/add/', { username, email, password });

// Function to get a user by ID
export const getUser = (userId) => 
  API.get(`/user/${userId}`);

// Function to login a user (Login)
export const loginUser = (email, password) => 
  API.post('/auth/login', { email, password });
