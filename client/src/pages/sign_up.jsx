import React, { useState } from "react";

// Experimental
function SignUp() {
  const [csrfToken, setCsrfToken] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.name
    ) {
      setError("All fields are required.");
      return;
    }

    const csrfResponse = await fetch("http://localhost:3000/form", {
      credentials: 'include',
    });
    const csrfData = await csrfResponse.json();

    try {
      if (!csrfData.csrfToken) {
        setError("Failed to fetch CSRF token.");
        return;
      }
      setCsrfToken(csrfData.csrfToken);
      console.log('in fetch')

      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfData.csrfToken, // Use the fetched CSRF token
        },
        body: JSON.stringify({
          query: `
            mutation AddUser($input: UserInput!) {
              addUser(input: $input) {
                email
                username
                redisKey
              }
            }
          `,
          variables: { input: formData },
        }),
        credentials: "include", 
      });
      const data = await response.json();
      console.log(data)
      if (data.errors) {
        setError(data.errors[0].message || "An error occurred.");
      } else if (data.data.signUp.success) {
        setSuccess(data.data.signUp.message || "Sign up successful!");
      }
    } catch (err) {
      setError("Error submitting the form.");
    }
  };

  return (
    <div className="sign-up-form">
      <form onSubmit={handleSubmit} className="sign-up-main-form">
        <h2>Sign Up</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <br />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <br />
        <br />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <br />
        <br />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignUp;
