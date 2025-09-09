import React, { useState } from "react";
import Joi from "joi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Joi Schema
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
      }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password should be at least 6 characters",
    }),
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function validateForm() {
    const { error } = schema.validate(formData, { abortEarly: false });
    if (!error) {
      setErrors({});
      return true;
    }
    const validationErrors = {};
    error.details.forEach((detail) => {
      validationErrors[detail.path[0]] = detail.message;
    });
    setErrors(validationErrors);
    return false;
  }

  async function submitLoginForm(e) {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    try {
      setLoading(true);
      const { user } = await login({
        email: formData.email,
        password: formData.password,
      });

      if (user?.role === "admin") navigate("/dashboard");
      else navigate("/home");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f0f0f0" }}
    >
      <div
        className="p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "100px",
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#333" }}>
          Login
        </h2>
        <form onSubmit={submitLoginForm}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-danger small">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter Your Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-danger small">{errors.password}</p>
            )}
          </div>

          <button
            className="btn btn-dark w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {err && <p className="text-danger mt-3 text-center">{err}</p>}

          <div className="d-flex justify-content-between mt-3">
            <span>Don’t have an account?</span>
            <Link to="/register" className="text-decoration-none">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
