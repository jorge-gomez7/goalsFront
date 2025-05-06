// App.jsx
import React, { useState } from 'react';
import './style.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
  });
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setTasks([...tasks, formData]);
    setFormData({ name: '', description: '', dueDate: '' });
    setShowMobileForm(false);
  };

  const handleRemove = index => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className='container'>
      <div className='menu-btn' onClick={toggleMenu}>
        ☰
      </div>

      {/* Formulario */}
      <div className={`form-container ${showMobileForm ? 'mobile-show' : ''}`}>
        <h1>Goals</h1>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            placeholder='Name'
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type='text'
            name='description'
            placeholder='Description'
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type='date'
            name='dueDate'
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
          <button type='submit'>ADD GOAL</button>
        </form>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className='mobile-menu'>
          <button onClick={() => setShowMobileForm(!showMobileForm)}>
            Add Goal
          </button>
        </div>
      )}

      {/* Cards */}
      <div className='tasks'>
        {tasks.map((task, index) => (
          <div className='task-card' key={index}>
            <p>
              <strong>Name:</strong>
              <br /> {task.name}
            </p>
            <p>
              <strong>Description:</strong>
              <br /> {task.description}
            </p>
            <p>
              <strong>Due Date:</strong> {task.dueDate}
            </p>
            <button onClick={() => handleRemove(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
