import api from "./api";

export const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/v1/auth/login", { email, password });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || "Login failed";
    }
  };
  
  export const register = async (email: string, password: string, username: string) => {
    try {
      const response = await api.post("/v1/auth/register", { email, password, username });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || "Registration failed";
    }
  };
  