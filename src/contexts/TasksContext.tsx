import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TASK_COLORS } from '../types';
import { useStats } from './StatsContext';

interface TasksContextType {
  tasks: Task[];
  addTask: (title: string, estimatedPomodoros?: number, color?: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  incrementTaskPomodoro: (id: string) => void;
  clearCompletedTasks: () => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const STORAGE_KEY = 'pomodoro-tasks';

export function TasksProvider({ children }: { children: ReactNode }) {
  const { incrementTasksCompleted } = useStats();

  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((t: Task) => ({
          ...t,
          color: t.color || TASK_COLORS[0],
          createdAt: new Date(t.createdAt),
          completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, estimatedPomodoros = 1, color = TASK_COLORS[0]) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      estimatedPomodoros,
      completedPomodoros: 0,
      isCompleted: false,
      color,
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const isNowComplete = !task.isCompleted;
          if (isNowComplete) {
            incrementTasksCompleted();
          }
          return {
            ...task,
            isCompleted: isNowComplete,
            completedAt: isNowComplete ? new Date() : undefined,
          };
        }
        return task;
      })
    );
  };

  const incrementTaskPomodoro = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
          : task
      )
    );
  };

  const clearCompletedTasks = () => {
    setTasks(prev => prev.filter(task => !task.isCompleted));
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    setTasks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        incrementTaskPomodoro,
        clearCompletedTasks,
        reorderTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
