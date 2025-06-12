# Manije

A modern project management application built with Next.js, featuring AI-powered job creation, project tracking, and collaborative workflows.

## Overview

Manije is a sophisticated project management platform that combines traditional project management features with AI-powered automation. The application allows users to create and manage projects, generate AI-driven job tasks, and collaborate effectively through an intuitive interface.

## Features

- **🤖 AI-Powered Job Creation**: Create jobs and tasks using natural language prompts
- **📊 Project Management**: Organize work into projects with comprehensive tracking
- **🔄 Real-time Updates**: Live updates and streaming for job creation processes
- **👥 User Authentication**: Secure authentication with Clerk integration
- **🎨 Modern UI**: Beautiful, responsive interface built with Tailwind CSS and Radix UI
- **🌙 Dark Mode Support**: System-aware theme switching
- **📱 Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives

### State Management & Data Fetching
- **TanStack Query (React Query)** - Server state management
- **React Context** - Client state management

### Authentication
- **Clerk** - Complete authentication solution

### Testing
- **Vitest** - Unit testing framework
- **Testing Library** - React component testing
- **jsdom** - DOM environment for testing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd manije-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:
- Clerk authentication keys
- API endpoints
- Any other required configuration

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── projects/          # Project-related pages
│   ├── sign-in/           # Authentication pages
│   └── ...
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── home.tsx          # Home page component
│   ├── jobs.tsx          # Job management
│   ├── project-*.tsx     # Project components
│   └── ...
├── hooks/                # Custom React hooks
│   ├── use-projects.ts   # Project data fetching
│   ├── use-jobs.ts       # Job management
│   └── ...
├── lib/                  # Utility libraries
│   ├── utils.ts          # General utilities
│   └── urls.ts           # URL constants
└── testing/              # Test utilities
```

## Key Components

### Home Component
The main landing page featuring:
- Project carousel showing recent projects
- AI-powered prompt input for job creation
- Smooth animations and transitions

### Job Management
- Create jobs using natural language prompts
- Stream job creation process in real-time
- Track job stages and progress
- Review and execute job actions

### Project Management
- Project overview and detailed views
- Project cards with visual indicators
- Collaborative project spaces

## Authentication

The app uses Clerk for authentication, providing:
- Secure sign-in/sign-up flows
- User profile management
- Waitlist functionality
- Dark theme integration

## Testing

Run tests with:
```bash
npm run test
```

The project uses Vitest with React Testing Library for comprehensive testing coverage.

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Sign in URL
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Sign up URL
- Additional API endpoints as needed

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Development Guidelines

- Follow TypeScript best practices
- Use existing UI components from the `ui/` directory
- Write tests for new features
- Follow the established project structure
- Use meaningful commit messages

## Performance Optimization

The app includes several performance optimizations:
- Next.js App Router for efficient routing
- React Query for smart data caching
- Framer Motion for smooth animations
- Tailwind CSS for optimized styling
- Image optimization with Next.js Image component

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)


Built with ❤️ by the Nomad Prime team
