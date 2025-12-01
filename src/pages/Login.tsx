import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { loginApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { saveAccessToken } from "../api/axios";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      console.log(res);
      saveAccessToken(res.data.accessToken, res.data.expiresAt);
      sessionStorage.setItem("refresh_token", res.data.refreshToken);
      login(res.data);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login Failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-5">
          Login
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-slate-700 text-white outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded bg-slate-700 text-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded mt-4"
          >
            {loading ? "Logging in" : "Login"}
          </button>
          {error && (
            <p className="text-red-400 text-center text-sm mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};
