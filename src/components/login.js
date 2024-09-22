import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Stored User:", storedUser); // Debugging log

    if (storedUser) {
      if (storedUser.email === email && storedUser.password === password) {
        setError("");
        console.log("Login successful"); // Debugging log
        onLogin(storedUser.progress); // Pass user progress on successful login
        localStorage.setItem("isLoggedIn", "true"); // Save login state
      } else {
        setError("Invalid email or password.");
      }
    } else {
      setError("No user found. Please sign up first.");
    }
  };

  return (
    <div className="login-container flex justify-center items-center pt-28 bg-amber-100">
      <div className="flex justify-center bg-slate-600 w-96 h-96 pb-4 pt-4 border rounded-lg shadow-lg shadow-slate-600">
        <div className="grid">
          <h2 className="text-xl font-bold">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="email"
            className="border p-2 h-10"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="border p-2 h-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 h-10 hover:bg-blue-600"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
