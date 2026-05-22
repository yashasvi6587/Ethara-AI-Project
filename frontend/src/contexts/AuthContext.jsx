import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('ttm_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('ttm_token') || '');

    useEffect(() => {
        if (token) {
            localStorage.setItem('ttm_token', token);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
            localStorage.removeItem('ttm_token');
            delete axios.defaults.headers.common.Authorization;
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('ttm_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('ttm_user');
        }
    }, [user]);

    const login = async (credentials) => {
        const response = await axios.post('/auth/login', credentials);
        setUser(response.data.user);
        setToken(response.data.token);
        return response;
    };

    const signup = async (payload) => {
        const response = await axios.post('/auth/register', payload);
        setUser(response.data.user);
        setToken(response.data.token);
        return response;
    };

    const logout = () => {
        setUser(null);
        setToken('');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
