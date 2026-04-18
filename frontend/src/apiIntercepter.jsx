import axios from "axios";

const server = "http://localhost:5000";

// 🔹 Get cookie
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
};

// 🔹 Axios instance
const api = axios.create({
    baseURL: server,
    withCredentials: true,
});

// 🔹 Attach CSRF token automatically
api.interceptors.request.use(
    (config) => {
        const methods = ["post", "put", "delete", "patch"];

        if (methods.includes(config.method)) {
            const csrfToken = getCookie("csrfToken");
            if (csrfToken) {
                config.headers["x-csrf-token"] = csrfToken;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 🔹 Auth queue
let isRefreshing = false;
let failedQueue = [];

// 🔹 CSRF queue
let isRefreshingCSRF = false;
let csrfQueue = [];

// 🔹 Queue handlers
const processQueue = (queue, error) => {
    queue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve();
    });
    queue.length = 0;
};

// 🔹 Response interceptor
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url || "";

        if (!error.response) return Promise.reject(error);

        const status = error.response.status;
        const errorCode = error.response.data?.code || "";

        // ❌ Skip refresh routes
        if (
            requestUrl.includes("/api/v1/refresh") ||
            requestUrl.includes("/api/v1/refresh-csrf")
        ) {
            return Promise.reject(error);
        }

        // =========================
        // 🔐 CSRF TOKEN HANDLING
        // =========================
        if (errorCode.startsWith("CSRF_") && !originalRequest._csrfRetry) {

            if (isRefreshingCSRF) {
                return new Promise((resolve, reject) => {
                    csrfQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }

            originalRequest._csrfRetry = true;
            isRefreshingCSRF = true;

            try {
                try {
                    await api.post("/api/v1/refresh-csrf");
                } catch (csrfError) {
                    if (
                        csrfError.response?.status === 401 ||
                        csrfError.response?.status === 403
                    ) {
                        await api.post("/api/v1/refresh");
                        await api.post("/api/v1/refresh-csrf");
                    } else {
                        throw csrfError;
                    }
                }

                processQueue(csrfQueue, null);
                return api(originalRequest);
            } catch (err) {
                processQueue(csrfQueue, err);
                console.error("Failed to refresh csrf token", err);
                return Promise.reject(err);
            } finally {
                isRefreshingCSRF = false;
            }
        }

        // =========================
        // 🔑 AUTH TOKEN HANDLING
        // =========================
        if ((status === 401 || status === 403) && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post("/api/v1/refresh");
                processQueue(failedQueue, null);
                return api(originalRequest);
            } catch (err) {
                processQueue(failedQueue, err);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
