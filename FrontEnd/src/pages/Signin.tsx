import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert("Username and password are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/v0/auth/login", {
         email: username,
        password,
      });

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error:", error.response.data);
        alert(error.response.data.message || "Login failed.");
      } else {
        console.error("Unexpected error:", error);
        alert("Something went wrong. Try again later.");
      }
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white border min-w-48 pt-8 pb-8 pl-4 pr-4 rounded-xl">
        <Input placeholder="Username" reference={usernameRef} />
        <Input placeholder="Password" reference={passwordRef} type="password" />
        <div className="flex justify-center p-4 items-center">
          <button onClick={signin}>Sign In</button>
        </div>
      </div>
    </div>
  );
}

function Input({ placeholder, reference, type = "text" }: { placeholder: string; reference?: any; type?: string }) {
  return (
    <div>
      <input ref={reference} placeholder={placeholder} type={type} className="px-4 py-2 border rounded m-2" />
    </div>
  );
}
