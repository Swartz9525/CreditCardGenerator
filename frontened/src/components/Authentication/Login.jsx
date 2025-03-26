import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      const { token, user } = response.data; // ✅ Ensure API returns both token & user

      login(token, user);
      navigate("/home"); // ✅ Redirect to home after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card
        className="shadow-lg p-4"
        style={{ width: "25rem", borderRadius: "10px" }}
      >
        <h3 className="text-center mb-3">Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email" className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3 w-100">
            Login
          </Button>
        </Form>
        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-primary">
            Sign Up
          </Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
