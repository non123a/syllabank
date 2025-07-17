# SyllaBank - Syllabi Management System Frontend

## Overview

SyllaBank is a comprehensive syllabi management solution designed specifically for Paragon International University. This frontend application is built with Next.js and provides a modern, user-friendly interface for managing course syllabi across all departments.

## Features

- **Syllabus Creation & Management**

  - Create and edit syllabi using LaTeX or custom templates
  - Real-time preview of syllabus changes
  - Support for multiple course sections
  - PDF generation and export

- **Approval Workflow**

  - Submission system for instructors
  - Review and approval process for HODs and Deans
  - Feedback and comment system

- **User Management**

  - Role-based access control (Instructors, HODs, Deans, Provost)
  - User profile management
  - Password change functionality

- **Template System**
  - Standardized syllabus templates
  - Custom template creation
  - LaTeX template support

## Tech Stack

- **Framework**: Next.js (Node v22.7.0)
- **UI Library**: Material-UI (MUI)
- **Form Management**: React Hook Form
- **State Management**: React Context
- **PDF Processing**: React-PDF
- **Code Editor**: CodeMirror
- **Animation**: Framer Motion
- **Internationalization**: i18n

## Getting Started

1. Clone the repository

   ```bash
   git clone [repository-url]
   ```

2. Install dependencies

   ```bash
   cd web
   npm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3030`

## Project Structure

web/
├── public/ # Static files
├── src/
│ ├── assets/ # Images and other assets
│ ├── components/ # Reusable components
│ ├── layouts/ # Page layouts
│ ├── pages/ # Next.js pages
│ ├── sections/ # Feature-specific components
│ ├── theme/ # MUI theme configuration
│ └── utils/ # Utility functions

## Contributing

SyllaBank was created with a vision to revolutionize syllabus management at Paragon International University. We welcome future developers to:

- Enhance and evolve the platform
- Add new features for future needs
- Maintain and improve the codebase

## Team

- **Bunhab Ung** - Tech Lead
- **Haksrun Lao** - Supervisor
- **Vannara Som** - Project Manager

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or refer to the project documentation.
