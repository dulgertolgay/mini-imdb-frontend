import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logged = useSelector((store) => store.logged);
  const user = useSelector((store) => store.user);

  const logout = () => {
    dispatch({ type: "logout" });
    navigate("/login");
  };

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          style={{ justifyContent: "space-between" }}
        >
          <Nav>
            <Link to="/">Movies</Link>
            <Link to="/casts">Casts & Crews</Link>,
            <Link to="/users">Active Users</Link>
          </Nav>
          {logged ? (
            <Nav>
              {user ? (
                <div className="flex-row">
                  <p
                    style={{
                      margin: "0",
                      color: "#ffffff",
                      padding: "8px",
                    }}
                  >
                    {user.username}
                  </p>
                  <img
                    height={30}
                    width={30}
                    alt="logo"
                    style={{ borderRadius: "15px", marginLeft: "10px" }}
                    src={require("../assets/pp-default.jpeg")}
                  />
                </div>
              ) : null}
              <Nav.Link
                href=""
                onClick={logout}
                style={{
                  color: "#ffffff",
                  marginLeft: "50px",
                }}
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
