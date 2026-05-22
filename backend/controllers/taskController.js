const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, projectId, assignedTo, dueDate } = req.body;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const task = await Task.create({
            title,
            description,
            project: projectId,
            assignedTo,
            dueDate,
        });

        project.tasks.addToSet(task._id);
        await project.save();

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

exports.getTasks = async (req, res, next) => {
    try {
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find().populate('project', 'name').populate('assignedTo', 'name email');
        } else {
            tasks = await Task.find({ assignedTo: req.user._id })
                .populate('project', 'name')
                .populate('assignedTo', 'name email');
        }
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

exports.updateTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (req.user.role !== 'admin' && !task.assignedTo.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        const { title, description, status, dueDate } = req.body;
        task.title = title ?? task.title;
        task.description = description ?? task.description;
        if (status) task.status = status;
        task.dueDate = dueDate ?? task.dueDate;
        await task.save();
        res.json(task);
    } catch (error) {
        next(error);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);
        if (project) {
            project.tasks.pull(task._id);
            await project.save();
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        next(error);
    }
};
