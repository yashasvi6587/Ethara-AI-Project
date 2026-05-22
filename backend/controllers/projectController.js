const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

exports.createProject = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, description } = req.body;
        const project = await Project.create({
            name,
            description,
            createdBy: req.user._id,
            members: [req.user._id],
        });

        await User.findByIdAndUpdate(req.user._id, { $addToSet: { projects: project._id } });
        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

exports.getProjects = async (req, res, next) => {
    try {
        let projects;
        if (req.user.role === 'admin') {
            projects = await Project.find().populate('members', 'name email role');
        } else {
            projects = await Project.find({ members: req.user._id }).populate('members', 'name email role');
        }
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

exports.getProjectById = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('members', 'name email role')
            .populate({ path: 'tasks', populate: { path: 'assignedTo', select: 'name email' } });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (req.user.role !== 'admin' && !project.members.some((member) => member._id.equals(req.user._id))) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(project);
    } catch (error) {
        next(error);
    }
};

exports.updateProject = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, description } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.name = name || project.name;
        project.description = description || project.description;
        await project.save();
        res.json(project);
    } catch (error) {
        next(error);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await Task.deleteMany({ project: project._id });
        await User.updateMany({ projects: project._id }, { $pull: { projects: project._id } });
        await project.deleteOne();

        res.json({ message: 'Project deleted' });
    } catch (error) {
        next(error);
    }
};

exports.addMember = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Member not found' });
        }

        project.members.addToSet(user._id);
        await project.save();
        user.projects.addToSet(project._id);
        await user.save();

        res.json({ project, member: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        next(error);
    }
};
