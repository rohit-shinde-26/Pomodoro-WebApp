# 🍅 Pomodoro Timer App

A beautiful, feature-rich Pomodoro timer application built with React and TypeScript. Stay focused, track your productivity, and achieve your daily goals.

## 🌐 Live Demo

https://pomodoro-web-app-black.vercel.app/

## ✨ Features

### Timer & Focus

- **Customizable Pomodoro Timer** - Adjust focus and break durations (1-60 min)
- **Focus Mode** - Press `F` to hide distractions and focus on the timer
- **Smart Time Snapping** - Timer adjusts in clean intervals (1, 5, 10, 15...)
- **Timer Presets** - Classic (25/5), Deep Work (50/10), Quick Tasks (15/3)

### Productivity Tracking

- **Streak Counter** 🔥 - Track your daily consistency
- **Weekly Charts** - Visualize your last 7 days of progress
- **Session Statistics** - Total pomodoros, focus time, completed tasks
- **Daily Goals** - Set and track your daily session targets

### Task Management

- **Task List** - Create, edit, and complete tasks
- **Color Coding** - Assign colors to categorize tasks
- **Preset Quick Add** - One-click task creation (Coding, Study, Gaming, etc.)
- **Task Progress** - Track pomodoros per task

### Customization

- **5 Theme Colors** - Red, Orange, Green, Blue, Purple
- **Browser Notifications** - Get notified when sessions complete
- **Sound Alerts** - Customizable alarm and ambient sounds
- **Motivational Quotes** - Random quotes that refresh on reset

### Authentication

- **Supabase Auth** - Secure email/password authentication
- **User Profiles** - Personalized experience with your name

### Keyboard Shortcuts

| Key       | Action              |
| --------- | ------------------- |
| `Space`   | Start/Pause timer   |
| `R`       | Reset timer         |
| `F`       | Toggle Focus Mode   |
| `←` / `→` | Cycle through modes |
| `↑` / `↓` | Adjust timer ±5 min |

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS-in-JS (inline styles)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Auth & Database**: Supabase
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for auth)

### Installation

```bash
# Clone the repository
git clone https://github.com/rohit-shinde-26/Pomodoro-WebApp.git
cd Pomodoro-WebApp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Made with ❤️ by [Rohit Shinde](https://github.com/rohit-shinde-26)

<h1><span style="color: red;">R</span>ED<span style="color: red;">N</span>OS</h1>
