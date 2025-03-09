
# Prayer Journal

Prayer Journal is a full-stack web application built with TypeScript, React, Express, and PostgreSQL that allows users to track and manage their prayer requests. Users can create an account, add prayer entries, mark them as resolved, and delete them.

## Features

- **User Authentication:** Register and login to your personal account
- **Prayer Management:** Create, update, and delete prayer entries
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
├── client/               # Frontend code
│   ├── src/              # React components and pages
│   └── index.html        # HTML entry point
├── server/               # Backend code
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database connection
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data access layer
├── shared/               # Shared code between frontend and backend
│   └── schema.ts         # Database schema definitions
└── package.json          # Project configuration
```

## Environment Configuration

- The application uses a PostgreSQL database for storing prayer entries and user data
- Authentication is handled via Passport.js with local strategy
- User passwords are securely hashed using scrypt
- Session data is stored in the PostgreSQL database

## Security

- Passwords are securely hashed using scrypt
- Session data is stored securely in the PostgreSQL database
- API endpoints are authenticated to prevent unauthorized access

## License

[MIT](LICENSE)
