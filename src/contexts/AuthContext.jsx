import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getMe = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me");
      const u = res.data.user ?? res.data;
      setUser(u);
      return u;
    } catch (err) {
      console.log(err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    const u = await getMe();
    return { res, user: u };
  };

  const register = async (payload) => {
    const res = await api.post("/auth/signup", payload);
    const u = await getMe();
    return { res, user: u };
  };
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log(err);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };
  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, register, getMe }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
