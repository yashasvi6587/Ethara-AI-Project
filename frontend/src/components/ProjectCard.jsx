import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';

function ProjectCard({ project }) {
    const activeTasks = project.tasks?.length || 0;
    return (
        <Link to={`/projects/${project._id}`} className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">{project.name}</h2>
                <StatusBadge label={`${activeTasks} tasks`} variant="primary" />
            </div>
            <p className="mt-3 text-slate-600">{project.description || 'No description provided.'}</p>
            <p className="mt-5 text-sm text-slate-500">Members: {project.members?.length || 0}</p>
        </Link>
    );
}

export default ProjectCard;
