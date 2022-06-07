import React, { useState } from "react";
import axios from "axios";
import "../styles/Signup.scss";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navigation from "../components/navbar";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mail, setMail] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    let uid = Math.floor(Math.random() * 1000000);
    try {
      await axios.get(
        `http://localhost:8080/api?queryString=
            INSERT INTO USER(uid, mail, country, username, password) 
            VALUES('${uid}', '${mail}', '${country}', '${username}', '${password}')`
      );
      const res = (
        await axios.get(
          `http://localhost:8080/api?queryString=
            SELECT *
            FROM USER
            WHERE mail='${mail}'`
        )
      ).data;
      let userData = res.data[0];
      dispatch({ type: "login" });
      dispatch({ type: "setUser", payload: userData });
      navigate("/");
    } catch (err) {
      console.log("err: ", err.message);
    }
  };

  return (
    <div id="signup">
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
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="Enter your username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Country Code</Form.Label>
          <Form.Control
            placeholder="Enter your country code"
            onChange={(e) => {
              setCountry(e.target.value);
            }}
          />
          <Form.Text className="text-muted">
            Please enter country code. Ex. TR or EN
          </Form.Text>
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
        <Button variant="primary" type="submit" onClick={handleSignup}>
          Sign Up
        </Button>
        <p className="green-text" onClick={() => navigate("/login")}>
          Back to login
        </p>
      </div>
    </div>
  );
};

export default Signup;
