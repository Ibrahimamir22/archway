# Archway - Interior Design Portfolio Platform

Archway is a comprehensive portfolio platform for an interior design company in Egypt, featuring admin capabilities, 3D/360° visualization, a chatbot, and enhanced user engagement features.

## Project Overview

### Frontend
- Next.js with TypeScript and Tailwind CSS
- Bilingual support (Arabic/English) with RTL layout for Arabic
- 13 client-facing pages (Home, Portfolio, About, Contact, etc.)
- PWA support (to be added)
- Dark mode (to be added)
- 3D/360°/AR visualization with Pannellum, Three.js, WebXR (to be added)
- Voice-enabled chatbot (to be added)

### Backend
- Django with Django REST Framework and PostgreSQL
- 9 admin pages (Projects, Analytics, etc.)
- Multiple apps for projects, users, bookings, etc.
- Secure APIs with JWT authentication (coming in Phase 3)
- Multi-language support (English and Arabic)

### Features
- User accounts with favorites and mood boards
- Cost estimator tool
- Gamification elements
- Multi-language support (Arabic and English)
- Analytics dashboard
- Sustainability metrics

### Security
- HTTPS
- JWT authentication (coming in Phase 3)
- CSRF protection
- Rate limiting (100 requests/hour for contact form)
- GDPR compliance

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js v18+ (for local development)
- Python 3.11+ (for local development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/archway.git
cd archway
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env` file:
```
# Database
DB_NAME=archway_db
DB_USER=archway_user
DB_PASSWORD=your_strong_password
DB_HOST=db
DB_PORT=5432

# Django 
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

4. Start the services with Docker Compose:
```bash
docker-compose up -d
```

5. Access the services:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/v1
   - Admin Panel: http://localhost:8000/admin

### Setting up SendGrid for Email Notifications

1. Sign up for a SendGrid account at https://sendgrid.com/
2. Create an API key in the SendGrid dashboard
3. Add the API key to your `.env` file:
```
SENDGRID_API_KEY=your_sendgrid_api_key
```
4. In production, uncomment and configure the SendGrid email settings in `backend/interior_platform/settings.py`

## Project Structure

### Frontend (Next.js)
```
frontend/
├── public/
│   ├── images/
│   └── locales/       # Translations for i18n
│       ├── en/        # English translations
│       └── ar/        # Arabic translations
├── src/
│   ├── app/           # Next.js app router
│   ├── components/    # React components
│   │   ├── common/    # Common UI components
│   │   ├── portfolio/ # Portfolio-related components
│   │   └── user/      # User-related components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── pages/         # Next.js pages
```

### Backend (Django)
```
backend/
├── apps/              # Django applications
│   ├── projects/      # Projects app
│   ├── testimonials/  # Testimonials app
│   ├── contact/       # Contact form app
│   └── ...            # Other apps
├── interior_platform/ # Django project settings
├── templates/         # HTML templates
│   └── contact/       # Email templates
├── media/             # User uploaded files
│   └── projects/      # Project images
└── locale/            # Translation files
    ├── en/            # English translations
    └── ar/            # Arabic translations
```

## Development Guidelines

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Run migrations:
```bash
cd backend
python manage.py migrate
```

4. Create a superuser:
```bash
cd backend
python manage.py createsuperuser
```

## Translation System

The project supports both English and Arabic with a complete translation system:

### Frontend
- Uses next-i18next for internationalization
- Translation files in JSON format at `public/locales/{lang}/common.json`
- Components use the `useTranslation` hook with `t('key.subkey')` pattern
- Cairo font for Arabic text with automatic RTL layout
- Language switcher in the navbar

### Backend
- Django's built-in translation framework
- Models store content in both languages (e.g., `title_en`, `title_ar`)
- APIs return translated content based on the user's language preference
- Language detection via request headers or explicit `lang` parameter

## Media File Handling

The project stores and serves media files as follows:

- Project images are stored in `media/projects/` and `media/projects/covers/`
- Served via Django during development and a CDN in production
- Accessed via the models with appropriate ImageField setup
- Frontend accesses images via API endpoints

## Project Status and Roadmap

### Phase 1: Project Setup & Structure ✅
- Set up project structure
- Initialize Next.js with TypeScript and Tailwind CSS
- Create basic Home and Portfolio pages
- Set up Django with PostgreSQL
- Configure Docker for local development

### Phase 2: Core Setup & Basic Frontend/Backend ✅
- Implement bilingual support (English and Arabic) with RTL
- Create About Us and Contact pages
- Enhance Portfolio page with filters, search, and favorites
- Add user authentication forms (signup/login)
- Set up projects and testimonials APIs
- Configure contact form with email notifications
- Implement security features (CSRF, rate limiting)

### Phase 2 Fixes ✅
- Completed translations for all UI text in English and Arabic
- Enabled RTL support using tailwindcss-rtl plugin
- Added Cairo font for Arabic text
- Connected frontend to backend API
- Added CSRF protection for forms
- Implemented rate limiting (100 requests/hour) for Contact API
- Added guest user handling for favorites feature
- Added complete image handling via Django's media system

### Phase 3: User Authentication & Portfolio Features 🔄
- Implement JWT authentication
- Create user profile and dashboard
- Build project detail page with image gallery
- Add favorites functionality
- Implement 3D/360° visualization

### Phase 4: Advanced Features
- Add mood board feature
- Implement cost estimator
- Add admin dashboard
- Create booking system

### Phase 5: Quality & Optimization
- Performance optimization
- SEO enhancements
- Accessibility improvements
- Cross-browser testing

### Phase 6: Testing & Deployment
- Unit and integration testing
- End-to-end testing
- Deploy to production

## License

This project is proprietary and not licensed for public use.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Django](https://www.djangoproject.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/) 