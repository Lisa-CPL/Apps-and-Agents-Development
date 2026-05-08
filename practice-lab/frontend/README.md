# CPL Practice Lab

A hub-and-spoke web application designed for new CPL members to practice individual conversation skills through short, standalone AI-powered exercises.

## 🌟 Overview

The Practice Lab allows users to browse a library of mini-apps, each focusing on a specific conversational skill (e.g., Active Listening, Identifying Ambiguity, Clarifying Questions). Each session presents a scenario, captures user input, and provides structured, actionable AI feedback based on CPL frameworks.

## 🚀 Features

- **Mini-App Hub**: A browsable grid of focused conversation exercises.
- **AI-Powered Scenarios**: Dynamically generated scenarios tailored to specific skills.
- **Structured Feedback**: Honest, encouraging, and actionable feedback focusing on conversational skill rather than views.
- **Community Hub**: Weekly challenges, workshops, and forums for collaborative learning.
- **Profile & Progress**: Track your journey and manage your learning profile.
- **Neutrality Guardrails**: AI-driven neutrality checks to ensure a safe and unbiased environment.

## 🛠 Tech Stack

- **Frontend**: React (TypeScript), Vite, Tailwind CSS.
- **Animations**: `motion/react` for smooth transitions and interactive elements.
- **Icons**: `lucide-react` for a consistent visual language.
- **State Management**: React Context for Auth and Profile; local component state for session-specific turn history.

## 🏗 Architecture

The application follows a stateless backend design where the conversation context lives entirely in the frontend's React state. This ensures privacy and simplifies the infrastructure.

### Key Directories
- `src/pages`: Application views (Hub, Lab Flow, Community, Profile, etc.)
- `src/components`: Reusable UI components (TopBar, BottomNav, MiniAppCards).
- `src/contexts`: Global state providers for Auth and User Profile.
- `src/data`: Static definitions for mini-apps and skills.

## 📖 Development

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 📄 License

This project is part of the CPL Mini-App Library. Intellectual property rights for the training curriculum and conversation frameworks belong to CPL.
