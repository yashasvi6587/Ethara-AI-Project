function StatusBadge({ label, variant = 'default' }) {
    const style = {
        default: 'bg-slate-100 text-slate-700',
        primary: 'bg-sky-100 text-sky-700',
        success: 'bg-emerald-100 text-emerald-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-rose-100 text-rose-700',
    }[variant];

    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}>{label}</span>;
}

export default StatusBadge;
