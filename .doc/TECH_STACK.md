# Technology Stack

This document outlines the core technologies used in the **Engineering Support Ticket Tool** and the rationale behind each choice.

## Core Framework & Language

- **React 19**: Leveraged for building a highly interactive and component-based user interface. Its latest features ensure optimal performance and a modern development experience.
- **TypeScript**: Used throughout the project to provide static typing, which reduces runtime errors, improves code quality, and enhances developer productivity through better IDE support.
- **Vite**: Chosen as the build tool and development server for its lightning-fast Hot Module Replacement (HMR) and efficient production builds.

## State Management & Navigation

- **Zustand**: A small, fast, and scalable barebones state-management solution. It was chosen over heavier alternatives for its simplicity and ease of integration with React's hook-based architecture.
- **React Router DOM**: Handles the application's routing and navigation, providing a seamless single-page application (SPA) experience with declarative routing.

## Styling & UI Components

- **Tailwind CSS 4**: A utility-first CSS framework used for rapid UI development. It allows for highly customizable designs directly in the markup, ensuring consistency and performance.
- **Radix UI**: A collection of unstyled, accessible UI primitives (Dialogs, Popovers, Selects, etc.). It ensures the application follows web accessibility (A11y) standards while allowing full styling control via Tailwind.
- **Framer Motion**: Integrated for high-performance animations and transitions, giving the application a premium, fluid feel.
- **Lucide React**: Provides a comprehensive and consistent set of icons that match the modern aesthetic of the tool.

## Specialized Libraries

- **@dnd-kit**: A modern drag-and-drop toolkit used to power the Kanban board. It provides a robust and accessible way to manage ticket transitions across different statuses.
- **TanStack Query (React Query)**: Used for managing server state, caching, and synchronization. It simplifies data fetching and provides out-of-the-box features like loading states and automatic re-fetching.
- **React Hook Form & Zod**: A powerful combination for form management and schema-based validation. It ensures data integrity and provides a great user experience with real-time feedback.
- **Recharts**: A composable charting library used for the analytics dashboard to visualize ticket trends and team performance data.
