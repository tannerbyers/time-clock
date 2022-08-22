import React from "react";
import { useEffect } from "react";
import { Nav, Container, Navbar, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useToken } from "./hooks";

const Navigation = () => {
  const { clearToken } = useToken();

  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  return (
    <Navbar bg="primary" variant="light">
      <Container>
        <Navbar.Brand href="/">Time Clock</Navbar.Brand>
        <Nav className="justify-content-end align-items-center">
          <Nav.Item>
            <Nav.Link>
              {/* TODO MAke these styles resusable links  */}
              <Link
                style={{ color: "white", textDecoration: "none" }}
                to="/dashboard"
              >
                Dashboard
              </Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>
              {/* TODO MAke these styles resusable links  */}
              <Link style={{ color: "white", textDecoration: "none" }} to="/">
                Login
              </Link>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Link
              style={{ color: "white", textDecoration: "none" }}
              to="/register"
            >
              Register
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              style={{ color: "white", textDecoration: "none" }}
              onClick={() => handleLogout()}
            >
              Logout
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
