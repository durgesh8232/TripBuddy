import axios from "axios";

// Base URL pointing to the FastAPI backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
});

// Authentication
export const authRegister = (data) => API.post("/auth/register", data);
export const authLogin = (data) => API.post("/auth/login", data);

// Trip Planning & Management
export const planTrip = (data) => API.post("/plan-trip", data);
export const fetchUserTrips = (userId) => API.get(`/my-trips/${userId}`);
export const deleteUserTrip = (tripId) => API.delete(`/trips/${tripId}`);

// Spot Swapper
export const swapActivity = (data) => API.post("/swap-activity", data);

// AI Chat Assistant
export const sendChat = (data) => API.post("/chat", data);

// Reviews & Ratings
export const submitReview = (data) => API.post("/reviews", data);
export const fetchReviews = (destination) => API.get(`/reviews/${encodeURIComponent(destination)}`);

export default API;