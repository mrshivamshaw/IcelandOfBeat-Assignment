import React, { type ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";

interface User {
    id: string;
    email: string;
    firstName: string
    lastName: string
    role: "admin" | "user"
};

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const response = await authApi.getCurrentUser();
                    setUser(response.user);
                } catch (error) {
                    localStorage.removeItem("token");
                    setToken(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, [token]);

    const login = async (email: string, password: string) => {
        const response = await authApi.login(email, password);
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem("token", response.token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    const register = async (firstName: string, lastName: string, email: string, password: string) => {
        const response = await authApi.register({ firstName, lastName, email, password });
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem("token", response.token);
    };

    const value : AuthContextType = { user, token, login, logout, register, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
