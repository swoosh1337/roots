# Roots and Ritual

![Roots and Ritual](https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-3.png)

Roots and Ritual is a habit-building application that helps users cultivate positive daily routines through visual growth metaphors and streak tracking. Watch your habits grow like trees as you maintain your daily rituals.

## Tech Stack

This project is built with modern web technologies:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Backend/Database**: Supabase (Authentication, Database, Storage)
- **State Management**: React Hooks and Context API
- **Routing**: React Router

## Features

- 🌱 Visual tree growth that represents habit streaks
- 🔥 Streak tracking and statistics
- 👥 User authentication and profiles
- 📊 Progress visualization
- 📱 Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- A Supabase account for backend services

### Environment Setup

1. Clone the repository
```bash
git clone https://github.com/swoosh1337/roots-and-ritual.git
cd roots-and-ritual
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the Application

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:8080`

## Development

### Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/hooks` - Custom React hooks
  - `/pages` - Page components
  - `/integrations` - External service integrations (Supabase)
  - `/styles` - Global styles

### Building for Production

```bash
npm run build
# or
yarn build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by habit-building apps and growth mindset principles
- Tree visualization concept draws from nature's growth patterns
- Built with ❤️ by the Roots and Ritual team