# VoiceClone

This project is a fullstack application with a Python-based backend and a Next.js-based frontend to clone your voice against any text you like.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Contributing](#contributing)

---

## Project Overview

This repository contains two main parts:

- **Backend**: A FastAPI Python service that provides API endpoints or processing logic. See [backend/app.py](backend/app.py) and [backend/cloning_model.ipynb](backend/cloning_model.ipynb).
- **Frontend**: A Next.js application offering a modern interface, with source files in [pages](pages) and [components](components). For detailed information, see [frontend/README.md](frontend/README.md).

---

## Technologies Used

- **Backend**
  - Python 3
  - Uvicorn for server reloading
  - Common packages such as `numpy`, `pandas`, and `torch` (refer to [backend/requirements.txt](backend/requirements.txt))
- **Frontend**
  - Next.js and React
  - Tailwind CSS
  - ESLint for code quality
  - TypeScript ([tsconfig.json](tsconfig.json) for configuration)

---

## Getting Started

Follow the steps below to run the project locally.

### Backend Setup

1. **Create and activate a virtual environment:**

   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install the required packages:**

   ```sh
   pip install -r backend/requirements.txt
   ```

3. **Run the backend server:**

   ```sh
   uvicorn app:app --reload
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```sh
   cd frontend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the development server:**

   ```sh
   npm run dev
   ```

4. **Open your browser:**

   Visit [http://localhost:3000](http://localhost:3000) to see the application running.

---

## Usage

### Backend

The backend server supports API calls and processing as defined in `app.py`. You can interact with these endpoints using REST clients or from the frontend.

### Frontend

The Next.js frontend includes pages and components such as `pages/index.tsx` and `components/text.tsx`. The app automatically reloads when changes are saved.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes and create a pull request.
4. Make sure to run tests and follow the established coding guidelines.

---

Happy coding!
