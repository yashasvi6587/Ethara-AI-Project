import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/api.js';
import TaskCard from '../components/TaskCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const { user } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get('/users/all');
            setUsers(res.data);
        };
        fetchUsers();
    }, []);

    const addMember = async () => {
        try {
            await axios.post(`/projects/${id}/add-member`, { email });
            alert("Member added ✅");
        } catch (err) {
            alert("Error adding member");
        }
    };

    useEffect(() => {
        const loadProject = async () => {
            try {
                const response = await axios.get(`/projects/${id}`);
                setProject(response.data);
            } catch (err) {
                setError('Unable to load project details');
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [id]);

    const overdueTasks = project?.tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed').length || 0;

    return (
        <div className="space-y-8">
            {/* {error && <div className="rounded-3xl bg-rose-100 p-4 text-rose-700">{error}</div>} */}
            {loading ? (
                <div className="rounded-3xl bg-white p-8 shadow-card">Loading project...</div>
            ) : project ? (
                <>
                    <div className="rounded-3xl bg-white p-8 shadow-card">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-semibold text-slate-900">{project.name}</h1>
                                <p className="mt-3 text-slate-600">{project.description || 'No description added yet.'}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <StatusBadge label={`${project.members.length} members`} variant="default" />
                                <StatusBadge label={`${project.tasks.length} tasks`} variant="primary" />
                                <StatusBadge label={`Overdue ${overdueTasks}`} variant="danger" />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                        <div className="rounded-3xl bg-white p-8 shadow-card">
                            <h2 className="text-2xl font-semibold text-slate-900">Team members</h2>
                            {user?.role === 'admin' && (
                                <div>
                                    <h3 className="text-lg font-semibold">Add Member</h3>

                                    <select
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    
                                        className="mt-2 border p-2 rounded"
                                    >
                                        <option value="">Select user</option>
                                        {users.map((u) => (
                                            <option key={u._id} value={u.email}>
                                                {u.name} ({u.email})
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={addMember}
                                        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                            <div className="mt-5 space-y-3">
                                {project.members.map((member) => (
                                    <div key={member._id} className="rounded-3xl border border-slate-200 p-4">
                                        <p className="font-semibold text-slate-900">{member.name}</p>
                                        <p className="text-sm text-slate-500">{member.email}</p>
                                        <p className="text-sm text-slate-500">Role: {member.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl bg-white p-8 shadow-card">
                            <h2 className="text-2xl font-semibold text-slate-900">Tasks</h2>
                            <div className="mt-5 space-y-4">
                                {project.tasks.length ? project.tasks.map((task) => <TaskCard key={task._id} task={task} />) : <p className="text-slate-500">No tasks yet for this project.</p>}
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}

export default ProjectDetails;
