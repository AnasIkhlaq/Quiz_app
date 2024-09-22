import React, { useState, useEffect } from "react";
import Login from "./components/login";
import Signup from "./components/signup";

const Quiz = () => {
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Lisbon"],
      answer: "Paris",
    },
    { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Jupiter", "Mars", "Saturn"],
      answer: "Jupiter",
    },
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Show login by default
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [quizComplete, setQuizComplete] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // Timer set to 10 seconds

  useEffect(() => {
    const loggedInState = localStorage.getItem("isLoggedIn");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (loggedInState === "true" && storedUser) {
      setIsLoggedIn(true);
      setCurrentQuestionIndex(storedUser.progress.currentQuestionIndex);
      setScore(storedUser.progress.score);
    }
  }, []);

  useEffect(() => {
    if (!quizComplete) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      if (timeLeft === 0) {
        handleTimeout();
      }

      return () => clearInterval(timer);
    }
  }, [timeLeft, quizComplete]);

  const handleSignup = () => {
    // Reset the quiz when signing up
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer("");
    setFeedback("");
    setQuizComplete(false);
    setTimeLeft(10); // Reset timer for the first question

    setIsSignup(false);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setCurrentQuestionIndex(storedUser.progress.currentQuestionIndex);
      setScore(storedUser.progress.score);
    }
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const progress = { currentQuestionIndex, score };
    storedUser.progress = progress;
    localStorage.setItem("user", JSON.stringify(storedUser));

    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  };

  const handleAnswerChange = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.answer) {
      setScore(score + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`Wrong! The correct answer was: ${currentQuestion.answer}`);
    }
    goToNextQuestion();
  };

  const handleTimeout = () => {
    setFeedback(`Time's up! The correct answer was: ${questions[currentQuestionIndex].answer}`);
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    setTimeout(() => {
      setFeedback("");
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer("");
        setTimeLeft(10); // Reset timer for next question
      } else {
        setQuizComplete(true);
      }
    }, 500);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setScore(0);
    setFeedback("");
    setQuizComplete(false);
    setTimeLeft(10); // Reset timer when restarting the quiz
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        {isSignup ? (
          <Signup onSignup={handleSignup} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
        <div className="flex justify-center pt-4 h-12 bg-amber-100">
          <button
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-3"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    );
  }

  let content;

  if (!quizComplete) {
    content = (
      <>
        <div>
          <div className="flex justify-center pt-6">
            <p className="text-lg md:text-xl lg:text-2xl font-semibold">
              {questions[currentQuestionIndex].question}
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <p className="text-md font-semibold">Time Left: {timeLeft} seconds</p>
          </div>
          <div className="grid justify-center gap-4 pt-6">
            {questions[currentQuestionIndex].options.map((option) => (
              <label className="block" key={option}>
                <input
                  type="radio"
                  onChange={() => handleAnswerChange(option)}
                  checked={selectedAnswer === option}
                />
                <span className="ml-2 text-sm md:text-lg lg:text-xl">{option}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="px-4 py-2 mt-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 w-full sm:w-1/2 lg:w-1/4"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
          >
            Submit Answer
          </button>
        </div>
        <div className="text-center">
          {feedback && <p className="mt-4 font-semibold">{feedback}</p>}
        </div>
      </>
    );
  } else {
    content = (
      <div className="grid justify-center pt-10 text-center">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold">
          Final Score: {score} / {questions.length}
        </h2>
        <button
          className="px-4 py-2 mt-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 w-full max-w-xs"
          onClick={handleRestart}
        >
          Restart Quiz
        </button>
      </div>
    );
    
  }

  return (
    <div
      className={`quiz-container min-h-screen ${
        darkMode ? "bg-gray-800 text-white" : "bg-amber-100"
      }`}
    >
      <div className="absolute top-4 right-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold flex justify-center pt-6">
        Quiz
      </h1>

      {/* Dark Mode Toggle */}
      <div className="flex justify-center pt-4">
        <label
          className="inline-flex items-center cursor-pointer"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <input
            type="checkbox"
            className="sr-only peer"
            onChange={toggleDarkMode}
            checked={darkMode}
          />
          <div className="relative w-11 h-6 bg-gray-600 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="px-4 sm:px-8 md:px-16 lg:px-32">{content}</div>
    </div>
  );
};

export default Quiz;
