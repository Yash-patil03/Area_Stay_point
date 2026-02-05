import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role') || 'User';
        const fullName = localStorage.getItem('fullName') || undefined;
        if (token && email) {
            setUser({ email, token, role, fullName });
        }
    }, []);

    const login = (email, token, role, fullName) => {
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        localStorage.setItem('role', role);
        if (fullName) localStorage.setItem('fullName', fullName);
        setUser({ email, token, role, fullName });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        setUser(null);
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const isOwner = user?.role?.toLowerCase() === 'owner';

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isOwner }}>
            {children}
        </AuthContext.Provider>
    );
};
