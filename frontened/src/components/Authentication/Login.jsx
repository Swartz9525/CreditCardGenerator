import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Redirect user after login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      console.log("Login Successful", response.data);
      setSuccess("Login successful!");
      localStorage.setItem("token", response.data.token);

      // Redirect to home/dashboard page
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error(err);
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Row className="justify-content-md-center w-100">
        <Col xs={12} md={4}>
          <Card className="shadow-lg p-3" style={{ borderRadius: "10px" }}>
            <h3 className="text-center mb-3">Login</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p>
                Not have an account?{" "}
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "blue" }}
                >
                  Signup
                </Link>
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
