import { useEffect, useState } from "react";
import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../services/taskService";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
  });
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await getAllTasks();
      setTasks(res.data.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
        setEditingTask(null);
      } else {
        await createTask(taskData);
      }

      setTaskData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
      });

      fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority || "medium",
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "700px",
        margin: "40px auto",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        To Do List
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={taskData.title}
          onChange={handleChange}
          required
          style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", outline: "none" }}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={taskData.description}
          onChange={handleChange}
          style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", outline: "none" }}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <select
            name="status"
            value={taskData.status}
            onChange={handleChange}
            style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
            style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: editingTask ? "#ff9800" : "#4CAF50",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "12px",
              borderBottom: "1px solid #f0f0f0",
              backgroundColor: "#fafafa",
              borderRadius: "8px",
              marginBottom: "10px",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: 0, color: "#333" }}>{task.title}</h4>
                <p style={{ margin: "4px 0", color: "#555" }}>{task.description}</p>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  Status: {task.status} | Priority: {task.priority}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleEdit(task)}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#f44336",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
