# SyllaBank - Syllabi Management System Backend

## Overview

SyllaBank's backend is built with Laravel and provides a robust API for managing course syllabi at Paragon International University. This system handles syllabus creation, approval workflows, user management, and PDF generation.

## Prerequisites

-   Docker
-   Docker Compose
-   PHP 8.1+
-   Composer
-   Node.js 20+
-   PostgreSQL 15

## Setup with Laravel Sail

1. Clone the repository:

```bash
git clone [repository-url]
cd syllabank-backend
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
composer install
```

4. Run the Laravel Sail setup:

```bash
./vendor/bin/sail up -d
```

5. Run the migrations:

```bash
./vendor/bin/sail artisan migrate:fresh --seed
```

6. Run the application key:

```bash
./vendor/bin/sail artisan key:generate
```

## Docker Configuration

The project uses Laravel Sail with the following services:

-   Laravel Application (PHP 8.1)
-   PostgreSQL 15
-   Redis
-   Mailpit (for local email testing)

Default ports:

-   Backend: `http://localhost:80`
-   PostgreSQL: `5432`
-   Redis: `6379`
-   Mailpit: `1025` (SMTP) and `8025` (Web Interface)

## Key Features

-   **Authentication & Authorization**

    -   Role-based access control (Admin, Dean, HOD, Instructor)
    -   Two-factor authentication
    -   Password management

-   **Syllabus Management**

    -   Custom template creation and management
    -   LaTeX template support
    -   PDF generation with watermarks
    -   Version control and history tracking

-   **Approval Workflow**

    -   Multi-step approval process
    -   Comment and feedback system
    -   Status tracking and notifications

-   **Course Management**
    -   Course assignment to instructors
    -   Section management
    -   Academic period tracking

## Development Commands

```bash
Start Sail
./vendor/bin/sail up -d
Stop Sail
./vendor/bin/sail down
Clear cache
./vendor/bin/sail artisan optimize:clear
Create super-admin
./vendor/bin/sail artisan admin:create
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests
4. Submit a pull request

## License

This project is proprietary software belonging to Paragon International University.
# syllabank
