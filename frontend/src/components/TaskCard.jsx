import StatusBadge from './StatusBadge.jsx';

const statusVariant = {
    todo: 'warning',
    'in-progress': 'primary',
    completed: 'success',
};

function TaskCard({ task, projectsMap,updateStatus  }) {
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline';

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{task.description || 'No description'}</p>
                </div>
                <StatusBadge label={task.status} variant={statusVariant[task.status] || 'default'} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>
                    Project: {task.project?.name || projectsMap?.[task.project] || 'Unknown'}
                </span>
                <span>Assigned to: {task.assignedTo?.name || 'Unassigned'}</span>
                <span>Due: {dueDate}</span>
            </div>
            <select
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
            >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>
        </div>
    );
}

export default TaskCard;
