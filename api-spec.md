# API Specifications

## Overview

This document outlines the RESTful API endpoints for the Archway Interior Design Portfolio Platform.

## Base URL

- Development: `http://localhost:8000/api/v1/`
- Production: `https://api.archway-design.com/api/v1/`

## Authentication

All API requests require authentication unless specified otherwise.

### JWT Authentication

```
Authorization: Bearer <token>
```

### Endpoints

#### Auth

- `POST /auth/register/` - Register a new user
- `POST /auth/login/` - Obtain JWT token
- `POST /auth/token/refresh/` - Refresh JWT token
- `POST /auth/password/reset/` - Request password reset
- `POST /auth/password/reset/confirm/` - Confirm password reset

#### Projects

- `GET /projects/` - List all projects (public, no auth required)
- `GET /projects/{slug}/` - Retrieve a specific project (public, no auth required)
- `POST /projects/` - Create a new project (admin only)
- `PUT /projects/{slug}/` - Update a project (admin only)
- `DELETE /projects/{slug}/` - Delete a project (admin only)
- `GET /projects/categories/` - List all project categories (public)
- `GET /projects/tags/` - List all project tags (public)

#### Users

- `GET /users/me/` - Get current user profile
- `PUT /users/me/` - Update current user profile
- `GET /users/{id}/` - Get user profile (admin only)
- `PUT /users/{id}/` - Update user profile (admin only)
- `DELETE /users/{id}/` - Delete user (admin only)

#### Favorites

- `GET /users/me/favorites/` - List user's favorites
- `POST /users/me/favorites/` - Add a project to favorites
- `DELETE /users/me/favorites/{project_id}/` - Remove a project from favorites

#### Mood Boards

- `GET /moodboards/` - List user's mood boards
- `POST /moodboards/` - Create a new mood board
- `GET /moodboards/{id}/` - Retrieve a specific mood board
- `PUT /moodboards/{id}/` - Update a mood board
- `DELETE /moodboards/{id}/` - Delete a mood board
- `POST /moodboards/{id}/projects/` - Add project to mood board
- `DELETE /moodboards/{id}/projects/{project_id}/` - Remove project from mood board
- `POST /moodboards/{id}/images/` - Add image to mood board
- `DELETE /moodboards/{id}/images/{image_id}/` - Remove image from mood board

#### Bookings

- `GET /bookings/` - List user's bookings
- `POST /bookings/` - Create a new booking
- `GET /bookings/{id}/` - Retrieve a specific booking
- `PUT /bookings/{id}/` - Update a booking
- `DELETE /bookings/{id}/` - Cancel a booking

#### Chatbot

- `POST /chat/start/` - Start a new chat session
- `POST /chat/message/` - Send a message and get a response
- `GET /chat/sessions/` - List user's chat sessions
- `GET /chat/sessions/{session_id}/messages/` - List messages in a chat session

## Response Format

All API responses follow this format:

```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "pagination": {
      "page": 1,
      "total_pages": 10,
      "total_items": 100,
      "items_per_page": 10
    }
  }
}
```

Or for errors:

```json
{
  "status": "error",
  "code": "error_code",
  "message": "Error message",
  "details": { ... }
}
```

## Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created
- `204 No Content` - Request succeeded with no response body
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Versioning

The API is versioned with a prefix in the URL. Current version is `v1`. 