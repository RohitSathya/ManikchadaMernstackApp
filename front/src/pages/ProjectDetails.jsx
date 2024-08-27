import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const { data } = await axios.get(`https://management-system-ochre.vercel.app/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(data);
      } catch (err) {
        setError('Failed to fetch project details. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`https://management-system-ochre.vercel.app/projects/${id}/tasks`, newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject({ ...project, tasks: [...project.tasks, data] });
      setNewTask({ title: '', description: '' });
    } catch (err) {
      setError('Failed to add task.');
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">{project.name}</h1>
      <p>{project.description}</p>
      <p className="text-sm text-gray-600 mt-2">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>

      <h2 className="text-2xl font-semibold mt-8">Tasks</h2>
      <form onSubmit={handleAddTask} className="mb-8">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">Task Title</label>
          <input
            type="text"
            id="title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter task title"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">Description</label>
          <textarea
            id="description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter task description"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Task</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {project.tasks && project.tasks.map(task => (
          <div key={task._id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetail;
