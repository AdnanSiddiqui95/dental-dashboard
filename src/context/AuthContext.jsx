import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const dummyUsers = [
  { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
  { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email, password) => {
    const matched = dummyUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (matched) {
      setUser(matched);
      localStorage.setItem("authUser", JSON.stringify(matched));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === "Admin", isPatient: user?.role === "Patient" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
