import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserStats, PomodoroSession, DailyStats, DEFAULT_STATS } from '../types';

interface StatsContextType {
  stats: UserStats;
  todayStats: DailyStats;
  addSession: (session: PomodoroSession) => void;
  incrementTasksCompleted: () => void;
  updateStreak: () => void;
  resetStats: () => void;
  exportStats: () => string;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

const STORAGE_KEY = 'pomodoro-stats';

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<UserStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_STATS, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_STATS;
      }
    }
    return DEFAULT_STATS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const getTodayStats = (): DailyStats => {
    const today = getTodayKey();
    const existing = stats.dailyStats.find(s => s.date === today);
    return existing || { date: today, totalPomodoros: 0, totalFocusTime: 0, tasksCompleted: 0 };
  };

  const addSession = (session: PomodoroSession) => {
    const today = getTodayKey();

    setStats(prev => {
      const existingIndex = prev.dailyStats.findIndex(s => s.date === today);
      let newDailyStats = [...prev.dailyStats];

      if (existingIndex >= 0) {
        newDailyStats[existingIndex] = {
          ...newDailyStats[existingIndex],
          totalPomodoros: newDailyStats[existingIndex].totalPomodoros + 1,
          totalFocusTime: newDailyStats[existingIndex].totalFocusTime + session.duration,
        };
      } else {
        newDailyStats.push({
          date: today,
          totalPomodoros: 1,
          totalFocusTime: session.duration,
          tasksCompleted: 0,
        });
      }

      // Keep only last 365 days
      if (newDailyStats.length > 365) {
        newDailyStats = newDailyStats.slice(-365);
      }

      return {
        ...prev,
        totalPomodoros: prev.totalPomodoros + 1,
        totalFocusTime: prev.totalFocusTime + session.duration,
        dailyStats: newDailyStats,
      };
    });
  };

  const incrementTasksCompleted = () => {
    const today = getTodayKey();

    setStats(prev => {
      const existingIndex = prev.dailyStats.findIndex(s => s.date === today);
      let newDailyStats = [...prev.dailyStats];

      if (existingIndex >= 0) {
        newDailyStats[existingIndex] = {
          ...newDailyStats[existingIndex],
          tasksCompleted: newDailyStats[existingIndex].tasksCompleted + 1,
        };
      } else {
        newDailyStats.push({
          date: today,
          totalPomodoros: 0,
          totalFocusTime: 0,
          tasksCompleted: 1,
        });
      }

      return {
        ...prev,
        totalTasksCompleted: prev.totalTasksCompleted + 1,
        dailyStats: newDailyStats,
      };
    });
  };

  const updateStreak = () => {
    const today = getTodayKey();

    setStats(prev => {
      const lastActive = prev.lastActiveDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split('T')[0];

      let newStreak = prev.currentStreak;

      if (lastActive === today) {
        // Already updated today
        return prev;
      } else if (lastActive === yesterdayKey) {
        // Consecutive day
        newStreak = prev.currentStreak + 1;
      } else if (lastActive !== today) {
        // Streak broken or first day
        newStreak = 1;
      }

      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActiveDate: today,
      };
    });
  };

  const resetStats = () => {
    setStats(DEFAULT_STATS);
  };

  const exportStats = (): string => {
    const headers = ['Date', 'Pomodoros', 'Focus Time (min)', 'Tasks Completed'];
    const rows = stats.dailyStats.map(s => [
      s.date,
      s.totalPomodoros.toString(),
      s.totalFocusTime.toString(),
      s.tasksCompleted.toString(),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  return (
    <StatsContext.Provider
      value={{
        stats,
        todayStats: getTodayStats(),
        addSession,
        incrementTasksCompleted,
        updateStreak,
        resetStats,
        exportStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
