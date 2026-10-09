import {  useState } from "react";
import { AuthContext } from "./authContext";
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem("token");
        return savedToken ? JSON.parse(savedToken) : null;
    });

    const [signUpData, setSignUpData] = useState({});

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

 
    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, signUpData, setSignUpData, logout }}>
            {children}
        </AuthContext.Provider>
    );
};