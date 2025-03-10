
# Prayer Tracker

Prayer Tracker is a full-stack web application built with TypeScript, React, Express, and PostgreSQL that allows users to track and manage their prayer requests. Users can create an account, add prayer entries, mark them as resolved, and delete them.

## Features

- **User Authentication:** Register and login to your personal account
- **Prayer Management:** Add, update, and delete prayer entries
- **Prayer Categories:** Organize prayers for unbelievers and brethren in hardship
- **Prayer Tracking:** Mark prayers as resolved or unresolved
- **Responsive Design:** Access from any device with a clean, modern UI

## Tech Stack

### Frontend
- React
- TypeScript
- TailwindCSS
- ShadcnUI for components
- React Query for data fetching
- Wouter for routing

### Backend
- Express.js
- PostgreSQL (via Neon)
- Drizzle ORM
- Passport.js for authentication
- Express Session with PostgreSQL session store

## Project Structure

```
├── client/                  # Frontend code
│   ├── src/                 # React components and pages
│   │   ├── components/      # UI components including prayer entries
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and API client
│   │   └── pages/           # Page components
│   └── index.html           # HTML entry point
├── server/                  # Backend code
│   ├── auth.ts              # Authentication logic
│   ├── db.ts                # Database connection
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   └── storage.ts           # Data access layer
├── shared/                  # Shared code between frontend and backend
│   └── schema.ts            # Database schema definitions
└── package.json             # Project configuration
```

## Getting Started

### Prerequisites
- Node.js and npm

### Installation

1. Clone the repository from Replit
2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables (on Replit, use the Secrets tool)
   - `DATABASE_URL`: PostgreSQL connection string
   - `SESSION_SECRET`: Secret for session encryption

### Running the Application

To start the development server:

```
npm run dev
```

This will start both the frontend and backend servers concurrently.

## Security Features

- Passwords are securely hashed using scrypt
- Session data is stored securely in the PostgreSQL database
- API endpoints are authenticated to prevent unauthorized access

## Deployment

The application can be deployed directly on Replit.

## License

[MIT](LICENSE)
