import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// === CONFIGURACIÓN ===
const API_URL = 'http://localhost:3000';
const HEADERS = { 'Content-Type': 'application/json', 'x-api-key': '12345' };

// === THUNKS ===

// 1. Obtener metas
export const fetchGoals = createAsyncThunk('goals/fetchGoals', async () => {
  const res = await fetch(`${API_URL}/getGoals`, { headers: HEADERS });
  return await res.json();
});

// 2. Agregar meta
export const addGoal = createAsyncThunk('goals/addGoal', async ({ title, description, deadline }) => {
  const res = await fetch(`${API_URL}/addGoal`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ title, description, deadline })
  });
  return await res.json();
});

// 3. Eliminar meta
export const removeGoal = createAsyncThunk('goals/removeGoal', async (goalId) => {
  await fetch(`${API_URL}/removeGoal`, {
    method: 'DELETE',
    headers: HEADERS,
    body: JSON.stringify({ id: goalId })
  });
  return goalId;
});

// 4. Agregar tarea a meta
export const addTaskToGoal = createAsyncThunk('goals/addTaskToGoal', async ({ goalId, taskTitle }) => {
  const res = await fetch(`${API_URL}/addTask`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ goalId, title: taskTitle })
  });
  return { goalId, task: await res.json() };
});

// 5. Eliminar tarea de meta
export const removeTaskFromGoal = createAsyncThunk('goals/removeTaskFromGoal', async ({ goalId, taskId }) => {
  await fetch(`${API_URL}/removeTask`, {
    method: 'DELETE',
    headers: HEADERS,
    body: JSON.stringify({ goalId, taskId })
  });
  return { goalId, taskId };
});

// 6. Cambiar estado completado de una tarea
export const toggleTaskCompletion = createAsyncThunk(
  'goals/toggleTaskCompletion',
  async ({ goalId, taskId, completed }) => {
    await fetch(`${API_URL}/updateTaskStatus`, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify({ goalId, taskId, completed })
    });
    return { goalId, taskId, completed };
  }
);


// === SLICE ===

const goalsSlice = createSlice({
  name: 'goals',
  initialState: [],
  reducers: {

  },
  extraReducers: builder => {
    builder
      .addCase(fetchGoals.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(removeGoal.fulfilled, (state, action) => {
        return state.filter(goal => goal._id !== action.payload);
      })
      .addCase(addTaskToGoal.fulfilled, (state, action) => {
        const { goalId, task } = action.payload;
        const goal = state.find(g => g._id === goalId);
        if (goal) goal.tasks.push(task);
      })
      .addCase(removeTaskFromGoal.fulfilled, (state, action) => {
        const { goalId, taskId } = action.payload;
        const goal = state.find(g => g._id === goalId);
        if (goal) {
          goal.tasks = goal.tasks.filter(task => task._id !== taskId);
        }
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        const { goalId, taskId, completed } = action.payload;
        const goal = state.find(g => g._id === goalId);
        const task = goal?.tasks.find(t => t._id === taskId);
        if (task) {
          task.completed = completed;
        }
      });
  }
});


export default goalsSlice.reducer;
