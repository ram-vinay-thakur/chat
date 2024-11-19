import { useState, useEffect } from "react";
import "./App.css";
import SignUp from "./pages/sign_up.jsx";

function App() {
  const [message, setMessage] = useState(""); // To hold the server response

  useEffect(() => {
    // Fetch request to the backend API
    fetch("http://localhost:3000/api/data", {
      method: "GET",
      credentials: "include", // This sends cookies with the request
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        setMessage(data.message); // Set the response message to state
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array so it runs only once when the component mounts

  return (
    <>
      <SignUp />
    </>
  );
}

export default App;
