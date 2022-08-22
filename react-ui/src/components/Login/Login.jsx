import React, { useState, useEffect } from "react";
import { Alert, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useToken } from "../hooks";
import { useNavigate } from "react-router-dom";

import "./Login.css";

async function loginUser(credentials) {
  return fetch("http://localhost:5000/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export default function Login() {
  const [employeeId, setEmployeeId] = useState();
  const { setToken, clearToken } = useToken();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    clearToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await loginUser({
      employeeId,
    });

    if (res.errorMessage) {
      setErrorMessage(res.errorMessage);
    } else {
      setErrorMessage();
      setToken(res);
      navigate("/dashboard");
    }
  };

  return (
    <div className="Login">
      <h1>Please Log In</h1>

      <Form onSubmit={handleSubmit}>
        {errorMessage && (
          <Alert key="danger" variant="danger">
            {errorMessage}
          </Alert>
        )}

        <div style={{ paddingBottom: "1em" }}>
          <label>
            <p>Employee Id</p>

            <Form.Control
              type="text"
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </label>
        </div>
        <div>
          <Button type="submit">Login</Button>
        </div>
      </Form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
