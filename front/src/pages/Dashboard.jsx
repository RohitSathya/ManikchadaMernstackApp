import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', deadline: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const { data: userData } = await axios.get('https://management-system-ochre.vercel.app/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(userData.name);

        const { data: projectsData } = await axios.get('https://management-system-ochre.vercel.app/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projectsData);
      } catch (err) {
        setError('Failed to fetch projects. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleCreateOrEditProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingProject) {
        // Update project
        const { data } = await axios.put(`https://management-system-ochre.vercel.app/api/projects/${editingProject._id}`, newProject, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projects.map(p => p._id === editingProject._id ? data : p));
        setEditingProject(null);
      } else {
        // Create new project
        const { data } = await axios.post('https://management-system-ochre.vercel.app/api/projects', newProject, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects([...projects, data]);
      }
      setNewProject({ name: '', description: '', deadline: '' });
    } catch (err) {
      setError('Failed to create or update project.');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setNewProject({ name: project.name, description: project.description, deadline: project.deadline.split('T')[0] });
  };

  const handleDelete = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://management-system-ochre.vercel.app/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (err) {
      setError('Failed to delete project.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-300 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-white">Project Dashboard</h1>
        <div className="flex items-center space-x-4">
          <p className="text-white text-lg">Welcome, {username}</p>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleCreateOrEditProject} className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">{editingProject ? 'Edit Project' : 'Create New Project'}</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold">Project Name</label>
          <input
            type="text"
            id="name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded mt-1"
            placeholder="Enter project name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold">Description</label>
          <textarea
            id="description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded mt-1"
            placeholder="Enter project description"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="deadline" className="block text-gray-700 font-bold">Deadline</label>
          <input
            type="date"
            id="deadline"
            value={newProject.deadline}
            onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded mt-1"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
          {editingProject ? 'Update Project' : 'Create Project'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project._id} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-purple-600">{project.name}</h2>
            <p className="text-gray-700">{project.description}</p>
            <p className="text-sm text-gray-500 mt-2">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
            <div className="mt-4 flex space-x-2">
              <button onClick={() => handleEdit(project)} className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">
                Edit
              </button>
              <button onClick={() => handleDelete(project._id)} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
