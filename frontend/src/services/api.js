import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Kullanıcı servisleri
export const userService = {
  // Yeni kullanıcı oluştur
  createUser: async (userData) => {
    try {
      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Bir hata oluştu" };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/users/login", credentials);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Giriş yapılırken bir hata oluştu" }
      );
    }
  },

  // Tüm kullanıcıları getir
  getUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Bir hata oluştu" };
    }
  },
};
