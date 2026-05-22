import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
                <Link to="/dashboard" className="text-xl font-semibold text-slate-900">
                    Team Task Manager
                </Link>
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
                                Dashboard
                            </Link>
                            <Link to="/tasks" className="text-sm text-slate-600 hover:text-slate-900">
                                Tasks
                            </Link>
                            <button
                                onClick={logout}
                                className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-800 hover:bg-slate-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="rounded-2xl bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
