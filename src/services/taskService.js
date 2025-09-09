import api from "../api/axios";

export const createTask = async (taskData) => {
  return await api.post("/task", taskData);
};

export const getAllTasks = async () => {
  return await api.get("/task");
};

export const searchTask = async (query) => {
  return await api.get(`/task/search?title=${query}`);
};

export const getSingleTask = async (id) => {
  return await api.get(`/task/${id}`);
};

export const updateTask = async (id, updatedData) => {
  return await api.put(`/task/${id}`, updatedData);
};

export const deleteTask = async (id) => {
  return await api.delete(`/task/${id}`);
};
