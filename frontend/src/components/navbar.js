import React from "react";
import { Navbar, Nav, Container, Form, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logged = useSelector((store) => store.logged);

  const logout = () => {
    dispatch({ type: "logout" });
    navigate("/login");
  };
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand>
          <img
            height={50}
            width={50}
            alt="logo"
            style={{ borderRadius: "25px" }}
            src={require("../assets/arda.jpeg")}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          style={{ justifyContent: "space-between" }}
        >
          <Nav>
            <Link to="/">Movies</Link>
            <Link to="/casts">Casts & Crews</Link>
          </Nav>
          {logged ? (
            <Nav>
              <Nav.Link
                href=""
                onClick={logout}
                style={{ color: "#ffffff", marginLeft: "50px" }}
              >
                Logout
              </Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Link to="/login">Log In</Link>
              <Link to="/signup">Sign Up</Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
