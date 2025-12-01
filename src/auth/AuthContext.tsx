import { createContext, useState } from "react";
import { saveAccessToken } from "../api/axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  const login = (data: any) => {
    saveAccessToken(data.accessToken, data.expiresAt);
    sessionStorage.setItem("refresh_token", data.refreshToken);
    setUser(data.user);
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
