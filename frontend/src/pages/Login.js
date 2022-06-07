import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Login.scss";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navigation from "../components/navbar";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    try {
      const res = (
        await axios.get(
          `http://localhost:8080/api?queryString=
            SELECT mail, password
            FROM USER
            WHERE mail='${mail}'`
        )
      ).data;
      let userData = res.data[0];
      if (userData.password === password) {
        dispatch({ type: "login" });
        navigate("/");
      } else {
        setError(true);
      }
    } catch (err) {
      console.log("err: ", err.message);
    }
  };

  return (
    <div id="login">
      <div className="card" style={{ width: "50%" }}>
        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            placeholder="Enter your email address"
            onChange={(e) => {
              setMail(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="**************"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        {error ? (
          <Alert key="danger" variant="danger">
            Wrong email or password!
          </Alert>
        ) : null}
        <Button variant="primary" type="submit" onClick={handleLogin}>
          Login
        </Button>
        <p className="green-text" onClick={() => navigate("/signup")}>
          or Sign Up
        </p>
      </div>
    </div>
  );
};

export default Login;
