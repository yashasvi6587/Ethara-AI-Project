import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import TaskCard from '../components/TaskCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

function Dashboard() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadData = async () => {
        try {
            setLoading(true);
            const [projectRes, taskRes] = await Promise.all([axios.get('/projects'), axios.get('/tasks')]);
            setProjects(projectRes.data);
            setTasks(taskRes.data);
        } catch (err) {
            setError('Unable to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const createProject = async (event) => {
        event.preventDefault();
        if (!newProjectName) return;

        try {
            const response = await axios.post('/projects', {
                name: newProjectName,
                description: newProjectDescription,
            });
            setProjects((current) => [response.data, ...current]);
            setNewProjectName('');
            setNewProjectDescription('');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to create project');
        }
    };

    const metrics = useMemo(() => {
        const completed = tasks.filter((task) => task.status === 'completed').length;
        const todo = tasks.filter((task) => task.status === 'todo').length;
        const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
        const overdue = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed').length;
        return { total: tasks.length, completed, todo, inProgress, overdue };
    }, [tasks]);

    return (
        <div className="space-y-8">
            <header className="rounded-3xl bg-white p-8 shadow-card">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Welcome back</p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{user?.name || 'Team Member'}</h1>
                        <p className="mt-2 text-slate-600">Role: {user?.role}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-3xl bg-slate-50 p-5 text-center">
                            <p className="text-sm text-slate-500">Total Tasks</p>
                            <p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.total}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5 text-center">
                            <p className="text-sm text-slate-500">Completed</p>
                            <p className="mt-2 text-3xl font-semibold text-emerald-700">{metrics.completed}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5 text-center">
                            <p className="text-sm text-slate-500">Pending</p>
                            <p className="mt-2 text-3xl font-semibold text-amber-700">{metrics.todo + metrics.inProgress}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5 text-center">
                            <p className="text-sm text-slate-500">Overdue</p>
                            <p className="mt-2 text-3xl font-semibold text-rose-700">{metrics.overdue}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* {error && <div className="rounded-3xl bg-rose-100 p-4 text-rose-700">{error}</div>} */}
            {loading ? (
                <div className="rounded-3xl bg-white p-8 shadow-card">Loading dashboard...</div>
            ) : (
                <>
                    {user?.role === 'admin' && (
                        <section className="rounded-3xl bg-white p-6 shadow-card">
                            <h2 className="text-xl font-semibold text-slate-900">Create new project</h2>
                            <form onSubmit={createProject} className="mt-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Project Name</label>
                                    <input
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Description</label>
                                    <textarea
                                        value={newProjectDescription}
                                        onChange={(e) => setNewProjectDescription(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                    />
                                </div>
                                <button className="rounded-2xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700">Add project</button>
                            </form>
                        </section>
                    )}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-slate-900">Projects</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {projects.length ? projects.map((project) => <ProjectCard key={project._id} project={project} />) : <div className="rounded-3xl bg-slate-50 p-8 text-slate-500">No projects found.</div>}
                        </div>
                    </section>
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-slate-900">Recent Tasks</h2>
                            <Link className="text-sky-600 hover:underline" to="/tasks">
                                View all tasks
                            </Link>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {tasks.slice(0, 6).map((task) => <TaskCard key={task._id} task={task} />)}
                            {!tasks.length && <div className="rounded-3xl bg-slate-50 p-8 text-slate-500">No tasks available.</div>}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

export default Dashboard;
