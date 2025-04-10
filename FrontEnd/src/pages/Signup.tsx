import React, { useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const name = nameRef.current?.value;

    if (!email || !password || !name) {
      alert("Credentials are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/v0/auth/signup", {
        email,
        password,
        name,
      });

     
      alert("Signup successful. Please log in.");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error:", error.response.data);
        alert(error.response.data.message || "Signup failed.");
      } else {
        console.error("Unexpected error:", error);
        alert("Something went wrong. Try again later.");
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex rounded-2xl shadow-2xl overflow-hidden bg-white max-w-2xl w-full">
        {/* Left Side */}
        <div className="bg-gradient-to-b from-purple-500 to-blue-500 p-12 w-2/3 flex flex-col justify-between">
          <div className="flex items-center mb-6 text-white p-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
           
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit-icon lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg>
            </div>
          </div>
          <div>
            <h2 className="text-white text-3xl font-bold mb-4">Create Account</h2>
            <p className="text-white text-lg">Join us and start managing your tasks effectively!</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-12 w-2/3">
          <form onSubmit={handleSignup}>
          <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                ref={nameRef}
                type="name"
                required
                className="block w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                ref={emailRef}
                type="email"
                required
                className="block w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                ref={passwordRef}
                type="password"
                required
                className="block w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white font-semibold py-3 rounded-md hover:bg-purple-600 transition hover:cursor-pointer"
            >
              Sign Up
            </button>
          </form>
          <p className="text-gray-500 text-center mt-6">
            Already have an account? <a href="/login" className="text-purple-500 hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;