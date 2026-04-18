import axios from "axios";

const server = "http://localhost:5000";

const api = axios.create({
    baseURL: server,
    withCredentials: true, // important for cookies
});

let isRefreshing = false;
let failedQueue = [];

// Process all queued requests
const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // ❌ If refresh itself fails → don't retry again
        if (originalRequest.url.includes("/api/v1/refresh")) {
            return Promise.reject(error);
        }

        // ✅ Handle 401 (token expired)
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {

            // 🟡 If refresh already running → wait
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => {
                    return api(originalRequest); // retry after refresh
                })
                .catch((err) => Promise.reject(err));
            }

            // 🟢 First request triggers refresh
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post("/api/v1/refresh"); // backend sets new cookie

                processQueue(null); // wake up queued requests

                return api(originalRequest); // retry original request
            } catch (err) {
                processQueue(err); // reject all queued
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error); // ✅ fixed typo
    }
);

export default api;