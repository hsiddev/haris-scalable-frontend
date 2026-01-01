# Media Distribution Frontend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the Frontend directory:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Features

- **Home Page**: Browse all photos with search and filtering
- **Creator View**: Upload photos with metadata (title, caption, location, people)
- **Consumer View**: Browse, view, comment, and rate photos
- **Authentication**: Login and registration with role-based access
- **Photo Details**: View full photo with comments and ratings

## User Roles

- **Creator**: Can upload photos with metadata
- **Consumer**: Can view, search, comment, and rate photos
