import axios from "axios";

const Api = axios.create({
    baseURL: "http://localhost:2000/api",
    headers: {
        "Content-Type": "application/json"
    }
});


// ================= AUTH =================
export const login = async (data) => {
    try {
        const res = await Api.post("/auth/login", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


// ================= CAR =================
export const createCar = async (data) => {
    try {
        const res = await Api.post("/car/add", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getCars = async () => {
    try {
        const res = await Api.get("/car/all");
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


// ================= SLOT =================
export const createSlot = async (data) => {
    try {
        const res = await Api.post("/slot/add", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getSlots = async () => {
    try {
        const res = await Api.get("/slot/all");
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


// ================= PARKING RECORD =================
export const getRecords = async () => {
    try {
        const res = await Api.get("/record/all");
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createRecord = async (data) => {
    try {
        const res = await Api.post("/record/add", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateRecord = async (id, data) => {
    try {
        const res = await Api.put(`/record/update/${id}`, data);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteRecord = async (id) => {
    try {
        const res = await Api.delete(`/record/delete/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


// 🔥 NEW: EXIT ACTION (VERY IMPORTANT)
export const markExit = async (id) => {
    try {
        const res = await Api.put(`/record/exit/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


// ================= PAYMENT =================
export const createPayment = async (data) => {
    try {
        const res = await Api.post("/payment/payments", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getPayments = async () => {
    try {
        const res = await Api.get("/payment/payments");
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getPaymentById = async (id) => {
    try {
        const res = await Api.get(`/payment/payments/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updatePayment = async (id, data) => {
    try {
        const res = await Api.put(`/payment/payments/${id}`, data);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deletePayment = async (id) => {
    try {
        const res = await Api.delete(`/payment/payments/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


// 🔥 NEW: PENDING PAYMENTS (COMPLETED BUT NOT PAID)
export const getPendingPayments = async () => {
    try {
        const res = await Api.get("/payment/payments/pending");
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};