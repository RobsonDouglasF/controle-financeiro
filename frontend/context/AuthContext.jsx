import { useState, createContext, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(() => {
        const salvar = localStorage.getItem('user');
        return salvar ? JSON.parse(salvar) : null;
    })
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    }
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null)
    }
    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}