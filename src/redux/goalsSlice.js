import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = [];

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(title, description, deadline) {
        return {
          payload: {
            id: nanoid(),
            title,
            description,
            deadline,
            tasks: [] // ← cada goal arranca sin tareas
          }
        };
      }
    },
    removeGoal: (state, action) => {
      return state.filter(goal => goal.id !== action.payload);
    },
    addTaskToGoal: {
      reducer(state, action) {
        const { goalId, taskTitle } = action.payload;
        const goal = state.find(g => g.id === goalId);
        if (goal) {
          goal.tasks.push({
            id: nanoid(),
            title: taskTitle,
            completed: false
          });
        }
      },
      prepare(goalId, taskTitle) {
        return {
          payload: { goalId, taskTitle }
        };
      }
    },
    toggleTaskCompletion: (state, action) => {
      const { goalId, taskId } = action.payload;
      const goal = state.find(g => g.id === goalId);
      const task = goal?.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    },
    removeTaskFromGoal: (state, action) => {
      const { goalId, taskId } = action.payload;
      const goal = state.find(g => g.id === goalId);
      if (goal) {
        goal.tasks = goal.tasks.filter(t => t.id !== taskId);
      }
    }
  }
});

export const {
  addGoal,
  removeGoal,
  addTaskToGoal,
  toggleTaskCompletion,
  removeTaskFromGoal
} = goalsSlice.actions;

export default goalsSlice.reducer;
