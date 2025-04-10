# Entity Relationship Diagram (ERD)

## Overview

This document outlines the database schema for the Archway Interior Design Portfolio Platform.

## Entities

### Project
- **id**: UUID (Primary Key)
- **title**: String
- **slug**: String (Unique)
- **description**: Text
- **category**: ForeignKey → ProjectCategory
- **client**: String
- **location**: String
- **area**: Float
- **completed_date**: Date
- **is_featured**: Boolean
- **created_at**: DateTime
- **updated_at**: DateTime
- **tags**: ManyToMany → Tag
- **designer**: ForeignKey → User

### ProjectImage
- **id**: UUID (Primary Key)
- **project**: ForeignKey → Project
- **image**: ImageField
- **alt_text**: String
- **is_cover**: Boolean
- **order**: Integer
- **created_at**: DateTime

### ProjectCategory
- **id**: UUID (Primary Key)
- **name**: String
- **slug**: String (Unique)
- **description**: Text
- **parent**: ForeignKey → ProjectCategory (Self-reference, optional)

### Tag
- **id**: UUID (Primary Key)
- **name**: String
- **slug**: String (Unique)

### User
- **id**: UUID (Primary Key)
- **email**: EmailField (Unique)
- **username**: String (Unique)
- **first_name**: String
- **last_name**: String
- **is_staff**: Boolean
- **is_admin**: Boolean
- **is_active**: Boolean
- **date_joined**: DateTime
- **last_login**: DateTime
- **role**: Choices (Client, Designer, Admin)

### UserProfile
- **id**: UUID (Primary Key)
- **user**: OneToOne → User
- **bio**: Text
- **profile_image**: ImageField
- **phone**: String
- **website**: URLField
- **social_links**: JSONField
- **preferences**: JSONField

### Favorite
- **id**: UUID (Primary Key)
- **user**: ForeignKey → User
- **project**: ForeignKey → Project
- **created_at**: DateTime

### MoodBoard
- **id**: UUID (Primary Key)
- **user**: ForeignKey → User
- **title**: String
- **description**: Text
- **is_public**: Boolean
- **created_at**: DateTime
- **updated_at**: DateTime
- **projects**: ManyToMany → Project
- **images**: ManyToMany → MoodBoardImage

### MoodBoardImage
- **id**: UUID (Primary Key)
- **mood_board**: ForeignKey → MoodBoard
- **image**: ImageField
- **description**: Text
- **order**: Integer
- **created_at**: DateTime

### Booking
- **id**: UUID (Primary Key)
- **user**: ForeignKey → User
- **service_type**: Choices
- **description**: Text
- **status**: Choices (Pending, Confirmed, Completed, Cancelled)
- **date**: DateTime
- **created_at**: DateTime
- **updated_at**: DateTime

### ChatSession
- **id**: UUID (Primary Key)
- **user**: ForeignKey → User (Optional)
- **session_id**: String (Unique)
- **created_at**: DateTime
- **updated_at**: DateTime

### ChatMessage
- **id**: UUID (Primary Key)
- **session**: ForeignKey → ChatSession
- **is_user**: Boolean
- **content**: Text
- **created_at**: DateTime

## Relationships

- A **Project** belongs to a **ProjectCategory**
- A **Project** has many **ProjectImages**
- A **Project** has many **Tags**
- A **Project** is designed by a **User**
- A **User** has one **UserProfile**
- A **User** can have many **Favorites**
- A **User** can have many **MoodBoards**
- A **MoodBoard** can have many **Projects**
- A **MoodBoard** can have many **MoodBoardImages**
- A **User** can have many **Bookings**
- A **User** can have many **ChatSessions**
- A **ChatSession** has many **ChatMessages**

## Notes

This schema is subject to change as the project evolves. 