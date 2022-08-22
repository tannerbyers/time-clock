import React, { useState } from "react";
import { Alert, Form, Button } from "react-bootstrap";
import { useToken } from "../hooks";
import { useNavigate } from "react-router-dom";
import "./Register.css";

async function registerUser(registrationInfo) {
  console.log(registrationInfo);
  return fetch("http://localhost:5000/register", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(registrationInfo),
  }).then((data) => data.json());
}

export default function Register() {
  const [employeeId, setEmployeeId] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const { setToken } = useToken();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await registerUser({
      employeeId,
      firstName,
      lastName,
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
      <h1>Registration</h1>

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
        <div style={{ paddingBottom: "1em" }}>
          <label>
            <p>First Name</p>

            <Form.Control
              type="name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
        </div>
        <div style={{ paddingBottom: "1em" }}>
          <label>
            <p>Last Name</p>

            <Form.Control
              type="name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>

        <div>
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </div>
  );
}
