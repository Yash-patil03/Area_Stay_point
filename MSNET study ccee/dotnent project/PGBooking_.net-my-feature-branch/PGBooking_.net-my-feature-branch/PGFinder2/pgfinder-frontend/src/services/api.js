// src/services/api.js
import axios from 'axios';

// Multiple API URLs for fallback
const API_URLS = [
    process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    'https://localhost:7071/api',
    'http://localhost:5000/api',
    'http://localhost:5297/api',
    'http://localhost:7071/api',
    'https://127.0.0.1:7071/api',
    'http://127.0.0.1:7071/api'
];

let currentApiUrl = API_URLS[0];

const api = axios.create({
    baseURL: currentApiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
    validateStatus: (status) => status >= 200 && status < 300,
});

// Network error retry logic
const retryRequest = async (config, urlIndex = 0) => {
    if (urlIndex >= API_URLS.length) {
        throw new Error('All API endpoints failed');
    }

    try {
        config.baseURL = API_URLS[urlIndex];
        currentApiUrl = API_URLS[urlIndex];
        const response = await axios(config);
        return response;
    } catch (error) {
        console.warn(`API URL ${API_URLS[urlIndex]} failed:`, error.message);
        return retryRequest(config, urlIndex + 1);
    }
};

// Add token to requests and enhanced error handling
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Enhanced response interceptor with retry logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Network error or timeout - try fallback URLs
        if (error.code === 'ECONNREFUSED' ||
            error.code === 'NETWORK_ERROR' ||
            error.code === 'ENOTFOUND' ||
            error.message.includes('Network Error') ||
            error.message.includes('timeout')) {

            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    return await retryRequest(originalRequest);
                } catch (retryError) {
                    console.error('All API endpoints failed:', retryError);
                    return Promise.reject(new Error('Unable to connect to server. Please check if the backend is running.'));
                }
            }
        }

        // HTTPS certificate error - try HTTP fallback
        if (error.message.includes('certificate') || error.message.includes('SSL')) {
            console.warn('HTTPS certificate issue, trying HTTP fallback');
            originalRequest.baseURL = originalRequest.baseURL.replace('https://', 'http://');
            return axios(originalRequest);
        }

        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    register: (fullName, email, password, phone, role) =>
        api.post('/auth/register', { fullName, email, password, phone, role: role || 'User' }),
};

// Booking API
export const bookingAPI = {
    getMyBookings: () => api.get('/bookings/my'),
    getBooking: (id) => api.get(`/bookings/${id}`),
    createBooking: (pgId) => api.post('/bookings', { pgId }),
};

// Payment API
export const paymentAPI = {
    createOrder: (bookingId) => api.post(`/payments/create-order/${bookingId}`),
    verifyPayment: (data) => api.post('/payments/verify', data),
};

// Review API
export const reviewAPI = {
    getReviews: (pgId) => api.get(`/review/${pgId}`),
    getMyReviews: () => api.get('/review/my'),
    addReview: (pgId, rating, comment) =>
        api.post('/review', { pgId, rating, comment }),
};

// Admin API
export const adminAPI = {
    getAllBookings: () => api.get('/admin/bookings'),
    getAllUsers: () => api.get('/admin/users'),
    getAllPayments: () => api.get('/admin/payments'),
    getPGs: () => api.get('/admin/pgs'),
    getStats: () => api.get('/admin/stats'),
    createPG: (pgData) => api.post('/admin/pgs', pgData),
    updatePG: (id, pgData) => api.put(`/admin/pgs/${id}`, pgData),
    deletePG: (id) => api.delete(`/admin/pgs/${id}`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
    updateBookingStatus: (id, status) => api.put(`/admin/bookings/${id}/status`, { status }),
};

// Owner API
export const ownerAPI = {
    getMyPGs: () => api.get('/owner/pgs'),
    createPG: (pgData) => api.post('/owner/pgs', pgData),
    updatePG: (id, pgData) => api.put(`/owner/pgs/${id}`, pgData),
    deletePG: (id) => api.delete(`/owner/pgs/${id}`),
    getPGBookings: (pgId) => api.get(`/owner/pgs/${pgId}/bookings`),
};

// PG API
export const pgAPI = {
    getAllPGs: (params) => api.get('/pg', { params }),
    getPG: (id) => api.get(`/pg/${id}`),
    createPG: (pgData) => api.post('/pg', pgData),
    updatePG: (id, pgData) => api.put(`/pg/${id}`, pgData),
    deletePG: (id) => api.delete(`/pg/${id}`),
};

// Discount API
export const discountAPI = {
    requestDiscount: (data) => api.post('/discounts', data),
    getPendingRequests: () => api.get('/discounts/pending'),
    approveRequest: (id, approvedPercent) => api.post(`/discounts/${id}/approve`, { approvedPercent }),
    rejectRequest: (id) => api.post(`/discounts/${id}/reject`),
    getHistory: () => api.get('/discounts/history'),
};

export default api;
