import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addGoal,
  removeGoal,
  addTaskToGoal,
  toggleTaskCompletion,
  removeTaskFromGoal,
  fetchGoals
} from './redux/goalsSlice';

import './style.css';



const App = () => {
  const goals = useSelector(state => state.goals);

const dispatch = useDispatch();

useEffect(() => { 
  dispatch(fetchGoals()); 
}, [dispatch]);

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
    dispatch(addGoal({
  title: formData.name,
  description: formData.description,
  deadline: formData.dueDate
}));


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
  <div className='task-card' key={goal._id}>
    <p><strong>Name:</strong><br /> {goal.title}</p>
    <p><strong>Description:</strong><br /> {goal.description}</p>
    <p><strong>Due Date:</strong> {goal.deadline}</p>
    <button onClick={() => handleRemove(goal._id)}>Remove Goal</button>

    {/* Tareas internas */}
    <div className='task-list'>
      <p><strong>Tasks:</strong></p>
      <ul>
        {goal.tasks?.map(task => (
          <li key={task._id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() =>
              dispatch(toggleTaskCompletion({
                goalId: goal._id,
                taskId: task._id,
                completed: !task.completed
              }))
            }
          />
            {task.title}
            <button onClick={() => dispatch(removeTaskFromGoal({ goalId: goal._id, taskId: task._id }))}>❌</button>
          </li>
        ))}
      </ul>
    </div>

    {/* Formulario para agregar tarea */}
    <form
      onSubmit={e => {
        e.preventDefault();
        const input = e.target.elements[`task-${goal._id}`];
        if (input.value.trim()) {
          dispatch(addTaskToGoal({ goalId: goal._id, taskTitle: input.value }));

          input.value = '';
        }
      }}
    >
      <input
        type="text"
        name={`task-${goal._id}`}
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
