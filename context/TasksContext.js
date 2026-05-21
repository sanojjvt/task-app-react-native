import React, { createContext, useContext, useState, useCallback } from 'react';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const addTask = useCallback((title) => {
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      description: '',
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const removeTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const markDone = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );
  }, []);

  const updateDescription = useCallback((id, description) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, description } : t))
    );
  }, []);

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, removeTask, toggleComplete, markDone, updateDescription }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used inside TasksProvider');
  return ctx;
}