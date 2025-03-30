import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const MyNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("User Data:", user); // Debugging user structure

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        {/* Brand Name */}
        <Navbar.Brand as={Link} to="/home" className="fw-bold">
          Card Generator
        </Navbar.Brand>

        {/* Toggle for Mobile */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/cards">
                My Cards
              </Nav.Link>
            )}
          </Nav>

          {/* User Section */}
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="text-white me-3">
                  Welcome,{" "}
                  <strong>{user?.name || user?.username || "User"}</strong>
                </span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="success" size="sm" onClick={() => navigate("/")}>
                Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
