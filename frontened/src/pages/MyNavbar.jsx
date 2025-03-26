import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("User Data:", user); // Debugging user structure

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-4">
      <Navbar.Brand href="/">Card Generator</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/home">Home</Nav.Link>
        </Nav>

        {user ? (
          <div className="d-flex align-items-center">
            <span className="text-white me-3">
              Welcome, {user?.name || user?.username || "Guest"}
            </span>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="success"
            size="sm"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
