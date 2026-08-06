import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "@/hooks/useAuth";
import { useState } from "react";

interface Errors {
  username?: string;
  password?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors | null>(null);
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(Object.keys(newErrors).length > 0 ? newErrors : null);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on form submit
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    loginMutation.mutate(
      { username: username.trim(), password: password.trim() },
      {
        onSuccess: () => navigate("/dashboard"),
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-black">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl">
        
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-500 tracking-wide">TrackIt</h1>
          <h2 className="text-xl text-gray-300 mt-2">Welcome Back</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              className="flex justify-content text-gray-300 text-sm font-semibold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-100 rounded-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors?.username && (
              <p className="text-red-400 text-xs  mt-1">{errors.username}</p>
            )}
          </div>
          
          <div>
            <label
              className="flex justify-content text-gray-300 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-100 rounded-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors?.password && (
              <p className="text-red-400 text-xs  mt-1">{errors.password}</p>
            )}
          </div>

          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 mt-4"
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}