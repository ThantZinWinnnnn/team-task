# Team Management Application

A modern team management application built with Next.js, TypeScript, and React that allows users to create teams, manage players, and handle authentication.

## Features

- 🔐 **User Authentication** - Login/logout functionality with local storage persistence
- 👥 **Team Management** - Create, update, and delete teams
- 🏃‍♂️ **Player Management** - Add and remove players from teams
- 📱 **Responsive Design** - Built with modern UI components
- 🎨 **Modern UI** - Styled with Tailwind CSS and Shadcn UI components

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Forms**: React Hook Form
- **State Management**: React Context API
- **Deployment**: Vercel

## Project Structure

```
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── home/             # Home page components
│   ├── team/             # Team management components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
├── store/                # Context providers and state management
│   ├── AuthContext.tsx   # Authentication context
│   └── TeamContext.tsx   # Team management context
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd team-next
```

2. Install dependencies:

```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication

The application uses the [`AuthContext`](store/AuthContext.tsx) for managing user authentication:

- Login with a username
- Authentication state persists in localStorage
- Protected routes require authentication

### Team Management

Teams are managed through the [`TeamContext`](store/TeamContext.tsx) which provides:

- Create new teams
- Update existing teams
- Delete teams
- Add players to teams
- Remove players from teams

### API

The application includes API routes for:

- Player data management (`/api/players`)

## Components

### UI Components

The project uses a collection of reusable UI components built with Radix UI:

- [`Button`](components/ui/button.tsx)
- [`Card`](components/ui/card.tsx)
- [`Dialog`](components/ui/dialog.tsx)
- [`Form`](components/ui/form.tsx)
- [`Badge`](components/ui/badge.tsx)
- [`Label`](components/ui/label.tsx)

### Feature Components

- **Login Form** ([`components/auth/login-form.tsx`](components/auth/login-form.tsx))
- **Team Form** ([`components/team/team-form.tsx`](components/team/team-form.tsx))
- **Team List** ([`components/team/team-list.tsx`](components/team/team-list.tsx))
- **Player List** ([`components/team/player-list.tsx`](components/team/player-list.tsx))

## Configuration

### ESLint

The project uses ESLint for code linting with configuration in [`eslint.config.mjs`](eslint.config.mjs).

### TypeScript

TypeScript configuration is set up in [`tsconfig.json`](tsconfig.json) with strict type checking.

### Tailwind CSS

Styling is configured through [`postcss.config.mjs`](postcss.config.mjs) and uses Tailwind CSS for utility-first styling.

## Deployment

The application is configured for deployment on Vercel with settings in [`vercel.json`](vercel.json).

To deploy:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Deploy automatically on every push to main branch

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
