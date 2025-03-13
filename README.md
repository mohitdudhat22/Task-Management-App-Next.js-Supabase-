let name = `# Project Management Dashboard

A full-stack Next.js application for managing projects and tasks with authentication, real-time updates, and a clean UI.

## Features

- 🔐 User authentication with email/password
- 📊 Project management dashboard
- ✅ Task tracking with status updates
- 🔄 Real-time data with React Query
- 🎨 Modern UI with Shadcn UI components
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: React Query (TanStack Query)
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohitdudhat22/Task-Management-App-Next.js-Supabase-
   cd project-management-dashboard
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/projectdb"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@example.com"
   EMAIL_SERVER_PASSWORD="your-email-password"
   EMAIL_FROM="noreply@example.com"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```bash
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Note

When creating a new account, the SMTP server might be rate-limited. You can:

1. Wait for the rate limiter to cool down, or
2. Use these test credentials:
   - Email: mohitdudhat22@gmail.com
   - Password: test@123

## Project Structure

- `/app` - Next.js app router pages and components
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and libraries
- `/types` - TypeScript types
- `/public` - Static assets
- `/utils` - Helper functions

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Add your feature"
   ```

3. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request on GitHub.

## Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the environment variables
4. Deploy!