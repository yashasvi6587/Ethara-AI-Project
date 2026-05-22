import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to login');
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-card">
            <h1 className="mb-2 text-3xl font-semibold">Login</h1>
            <p className="mb-6 text-slate-600">Access your project dashboard and manage tasks.</p>
            {error && <div className="mb-4 rounded-lg bg-rose-100 px-4 py-3 text-rose-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    <span className="text-sm font-medium text-slate-700">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:ring-sky-500"
                    />
                </label>
                <label className="block">
                    <span className="text-sm font-medium text-slate-700">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:ring-sky-500"
                    />
                </label>
                <button type="submit" className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-white transition hover:bg-sky-700">
                    Sign in
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600">
                Need an account? <Link className="text-sky-600 hover:underline" to="/signup">Sign up</Link>
            </p>
        </div>
    );
}

export default Login;
