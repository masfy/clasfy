# Clasfy - Modern Classroom Management System

Clasfy is a comprehensive web-based application designed to streamline classroom management for teachers and students. It features a modern, responsive interface and integrates with Google Apps Script for a lightweight, flexible backend.

## ✨ Features

### 👨‍🏫 For Teachers
- **Dashboard**: Real-time overview of student attendance and performance.
- **Attendance Tracking (Presensi)**: Easy-to-use interface for marking and viewing daily attendance.
- **Gamification**: Manage leaderboards, badges, and challenges to motivate students.
- **Task Management**: Create and track assignments.
- **Student Management**: View and manage student profiles.

### 👨‍🎓 For Students
- **Student Portal**: Personalized dashboard showing progress and stats.
- **Attendance**: View personal attendance history.
- **Tasks**: Submit and track assignments.
- **Leaderboard**: View rankings and earned badges.
- **Profile**: Manage personal settings.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **State/Storage**: `idb-keyval` (IndexedDB)
- **Backend**: Google Apps Script (GAS)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/masfy/clasfy.git
    cd clasfy
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env.local` file in the root directory and add your Google Apps Script Web App URL:
    ```env
    NEXT_PUBLIC_API_URL=your_google_apps_script_url
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📂 Project Structure

- \`src/app/(auth)\`: Authentication pages (Login).
- \`src/app/(student)\`: Student portal pages.
- \`src/app/(teacher)\`: Teacher portal pages.
- \`src/components\`: Reusable UI components.
- \`src/lib\`: Utility functions and API configuration.

## 📄 License

This project is private.
