const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};


exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description, deadline } = req.body;

    const newProject = new Project({
      user: req.user.id,
      name,
      description,
      deadline: new Date(deadline),
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project' });
  }
};

exports.addTaskToProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, description } = req.body;
    const newTask = { title, description };

    project.tasks.push(newTask);
    await project.save();

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add task' });
  }
};
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.deadline = req.body.deadline || project.deadline;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project' });
  }
};



exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};
