import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addGoal,
  removeGoal,
  addTaskToGoal,
  toggleTaskCompletion,
  removeTaskFromGoal
} from './redux/goalsSlice';




import './style.css';

const App = () => {
  const goals = useSelector(state => state.goals);

  const dispatch = useDispatch();

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
    dispatch(addGoal(formData.name, formData.description, formData.dueDate));

    setFormData({ name: '', description: '', dueDate: '' });
    setShowMobileForm(false);
  };

  const handleRemove = index => {
    dispatch(removeGoal(index));
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
    {goals.map((goal) => (
  <div className='task-card' key={goal.id}>
    <p><strong>Name:</strong><br /> {goal.title}</p>
    <p><strong>Description:</strong><br /> {goal.description}</p>
    <p><strong>Due Date:</strong> {goal.deadline}</p>
    <button onClick={() => handleRemove(goal.id)}>Remove Goal</button>

    {/* Tareas internas */}
    <div className='task-list'>
      <p><strong>Tasks:</strong></p>
      <ul>
        {goal.tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                dispatch(toggleTaskCompletion({ goalId: goal.id, taskId: task.id }))
              }
            />
            {task.title}
            <button onClick={() => dispatch(removeTaskFromGoal({ goalId: goal.id, taskId: task.id }))}>❌</button>
          </li>
        ))}
      </ul>
    </div>

    {/* Formulario para agregar tarea */}
    <form
      onSubmit={e => {
        e.preventDefault();
        const input = e.target.elements[`task-${goal.id}`];
        if (input.value.trim()) {
          dispatch(addTaskToGoal(goal.id, input.value));
          input.value = '';
        }
      }}
    >
      <input
        type="text"
        name={`task-${goal.id}`}
        placeholder="New Task"
        required
      />
      <button type="submit">Add Task</button>
    </form>
  </div>
))}

      </div>
    </div>
  );
};

export default App;
