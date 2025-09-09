import React, { useState } from "react";
import Joi from "joi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const navigate = useNavigate();
  // Joi Schema
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name should be at least 3 characters",
      "string.max": "Name should not exceed 30 characters",
    }),
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
    repeatPassword: Joi.any().equal(Joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
      "any.required": "Repeat password is required",
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

  async function submitRegisterForm(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Joi validation
    if (!validateForm()) return;

    try {
      setLoading(true);
      const { user } = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (user?.role === "admin") navigate("/dashboard");
      else navigate("/home");

      setFormData({
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
      });
      setErrors({});
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
      }}
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
          Register
        </h2>
        <form onSubmit={submitRegisterForm}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter Your Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className="text-danger small">{errors.username}</p>
            )}
          </div>

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

          {/* Repeat Password */}
          <div className="mb-3">
            <label className="form-label">Repeat Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Repeat password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
            />
            {errors.repeatPassword && (
              <p className="text-danger small">{errors.repeatPassword}</p>
            )}
          </div>

          <button
            className="btn btn-dark w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Submit"}
          </button>

          {err && <p className="text-danger mt-3 text-center">{err}</p>}
          {success && (
            <p className="text-success mt-3 text-center">{success}</p>
          )}
          <div className="d-flex justify-content-between mt-3">
            <span>Already have an account?</span>
            <Link to="/login" className="text-decoration-none">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
