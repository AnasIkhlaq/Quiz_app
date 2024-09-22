import React, { useState } from "react";

const Signup = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check if the email already exists in localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email === email) {
      setError("You already have an account.");
      return;
    }

    // Save new user data to localStorage
    const user = { email, password, progress: { currentQuestionIndex: 0, score: 0 } };
    localStorage.setItem("user", JSON.stringify(user));
    console.log("User signed up: ", user); // Debugging log

    setError("");
    onSignup(); // Callback to indicate signup is successful
  };

  return (
    <div className="signup-container flex justify-center items-center pt-28 bg-amber-100">
      <div className="flex justify-center bg-slate-600 w-96 h-96 pb-4 pt-4 border rounded-lg shadow-lg shadow-slate-600">
        <div className="grid">
          <h2 className="text-xl font-bold">Signup</h2>
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
          <input
            type="password"
            className="border p-2 h-10"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 h-10 hover:bg-blue-600"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
