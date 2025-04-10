# Archway - Interior Design Portfolio Platform

A comprehensive platform for interior designers to showcase their work with advanced visualization, client interaction, and project management features.

## Features

- **Portfolio Showcase**: Display projects with images, descriptions, and 3D/360° visualizations
- **Client Portal**: User accounts, favorites, mood boards, and project cost estimator
- **Admin Dashboard**: Manage projects, bookings, and analytics
- **Interactive Tools**: Voice-enabled chatbot, AR visualizations, and sustainability metrics
- **Multi-language Support**: Internationalization for global reach

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Django with Django REST Framework
- **Database**: PostgreSQL
- **Deployment**: Docker, Vercel (frontend), DigitalOcean (backend)

## Project Structure

```
archway/
├── frontend/                # Next.js application
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Next.js pages
│   ├── public/              # Static assets
│   ├── styles/              # Global styles and Tailwind config
│   └── tests/               # Frontend tests
├── backend/                 # Django application
│   ├── interior_platform/   # Django project settings
│   ├── apps/                # Django apps (projects, users, etc.)
│   ├── utils/               # Backend utilities
│   └── tests/               # Backend tests
└── docker/                  # Docker configuration
```

## Development Setup

### Prerequisites

- Docker and Docker Compose
- Node.js (16+)
- Python (3.9+)

### Running with Docker

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/archway.git
   cd archway
   ```

2. Create your environment file from the example:
   ```
   cp .env.example .env
   ```

3. Update the `.env` file with your secure credentials

4. Start the Docker containers:
   ```
   docker-compose up
   ```

5. Access the services:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Admin panel: http://localhost:8000/admin/

### Environment Variables

The project uses environment variables for configuration. These are stored in a `.env` file in the root directory and are automatically loaded by Docker Compose. Key variables include:

- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`: Database connection details
- `SECRET_KEY`: Django secret key (generate a secure one for production)
- `DEBUG`: Set to "True" for development, "False" for production
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `CORS_ALLOWED_ORIGINS`: Allowed origins for CORS

For security, the `.env` file is not committed to the repository. An example file (`.env.example`) is provided as a template.

### Local Development (Non-Docker)

See detailed instructions in the [Development Guide](docs/development.md).

## Documentation

- [Wireframes](wireframes.md)
- [Database Schema](erd.md)
- [API Specifications](api-spec.md)

## License

MIT 