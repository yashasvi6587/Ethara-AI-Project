import { useEffect, useMemo, useState } from 'react';
import axios from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import TaskCard from '../components/TaskCard.jsx';

const statusOptions = ['all', 'todo', 'in-progress', 'completed'];

function Tasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [projectFilter, setProjectFilter] = useState('all');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const updateStatus = async (taskId, status) => {
        try {
            const res = await axios.put(`/tasks/${taskId}`, { status });

            setTasks(prev =>
                prev.map(t => t._id === taskId ? res.data : t)
            );
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [taskRes, projectRes] = await Promise.all([axios.get('/tasks'), axios.get('/projects')]);
                setTasks(taskRes.data);
                setProjects(projectRes.data);
            } catch (err) {
                setError('Unable to load tasks');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const selectedProject = useMemo(
        () => projects.find((project) => project._id === selectedProjectId),
        [projects, selectedProjectId]
    );

    const createTask = async (event) => {
        event.preventDefault();
        if (!newTaskTitle || !selectedProjectId || !newTaskAssignedTo) return;

        try {
            const response = await axios.post('/tasks', {
                title: newTaskTitle,
                description: newTaskDescription,
                projectId: selectedProjectId,
                assignedTo: newTaskAssignedTo,
                dueDate: newTaskDueDate || null,
            });
            setTasks((current) => [response.data, ...current]);
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskDueDate('');
            setNewTaskAssignedTo('');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to create task');
        }
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            if (statusFilter !== 'all' && task.status !== statusFilter) return false;
            if (projectFilter !== 'all' && task.project?._id !== projectFilter) return false;
            return true;
        });
    }, [tasks, statusFilter, projectFilter]);

    const projectsMap = useMemo(() => {
        const map = {};
        projects.forEach(p => {
            map[p._id] = p.name;
        });
        return map;
    }, [projects]);

    return (
        <div className="space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-card">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">Task Management</h1>
                        <p className="mt-2 text-slate-600">Filter tasks by status and project, then review assignment details.</p>
                    </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Project</label>
                        <select
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                            <option value="all">All Projects</option>
                            {projects.map((project) => (
                                <option key={project._id} value={project._id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {user?.role === 'admin' && (
                <div className="rounded-3xl bg-white p-6 shadow-card">
                    <h2 className="text-xl font-semibold text-slate-900">Create new task</h2>
                    <form onSubmit={createTask} className="mt-5 grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Title</label>
                            <input
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Project</label>
                            <select
                                value={selectedProjectId}
                                onChange={(e) => {
                                    setSelectedProjectId(e.target.value);
                                    setNewTaskAssignedTo('');
                                }}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            >
                                <option value="">Select project</option>
                                {projects.map((project) => (
                                    <option key={project._id} value={project._id}>{project.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Assign to</label>
                            <select
                                value={newTaskAssignedTo}
                                onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            >
                                <option value="">Select member</option>
                                {selectedProject?.members?.map((member) => (
                                    <option key={member._id} value={member._id}>{member.name} ({member.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Due date</label>
                            <input
                                type="date"
                                value={newTaskDueDate}
                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            />
                        </div>
                        <button type="submit" className="md:col-span-2 rounded-2xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700">
                            Create task
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="rounded-3xl bg-white p-8 shadow-card">Loading tasks...</div>
            ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                    {filteredTasks.length
                        ? filteredTasks.map((task) => <TaskCard key={task._id} task={task} projectsMap={projectsMap} updateStatus={updateStatus} />)
                        : <div className="rounded-3xl bg-slate-50 p-8 text-slate-500">No tasks match the selected filters.</div>}
                </div>
            )}
        </div>
    );
}

export default Tasks;
