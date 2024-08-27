const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');


router.get('/', protect, projectController.getProjects);


router.get('/:id', protect, projectController.getProjectById);


router.post('/', protect, projectController.createProject);

router.post('/:id/tasks', protect, projectController.addTaskToProject);
router.put('/:id', protect, projectController.updateProject);
router.delete('/:id', protect, projectController.deleteProject);

module.exports = router;
