# To-Do List Application

A simple yet powerful To-Do List Application built with **Next.js** (Front-End), **Express.js** (Back-End) and **Docker** for containerization, with **MongoDB** for the database. This project focuses on clean design, usability, and efficient development practices.

---

## Features

### Back-End (Express.js)

- **RESTful APIs:**
  - `GET /tasks`: Fetch all tasks.
  - `POST /tasks`: Add a task.
  - `PUT /tasks/:id`: Update a task.
  - `DELETE /tasks/:id`: Delete a task.
- **Data Integrity Rules:**
  - Prevent invalid statuses.
  - Ensure due dates are not in the past.

### Database (MongoDB)

- **Schema:**
  - `id`: Unique identifier.
  - `title`: Task name.
  - `description`: Optional description.
  - `status`: Enum (Pending/In Progress/Completed).
  - `dueDate`: Due date for the task.
  - `createdAt` and `updatedAt`: Timestamps.

### Additional Enhancements

- **Pagination and Sorting:** For handling larger task lists efficiently.
- **Docker:** For consistent environment setup.
- **Deployment:**
  - Back-End on **Vercel**.
  - Front-End on **Vercel**.

### Front-End (Next.js)

- **Task Dashboard:**
  - Organized table layout with columns for Title, Description, Status, Due Date, and Actions (Edit/Delete).
- **Task Management Forms:**
  - Create and edit tasks with fields: Title, Description, Status (Pending/In Progress/Completed), and Due Date.
  - Validations to ensure required fields and prevent past due dates.
- **Search and Filter:**
  - Search tasks by title.
  - Filter tasks by status.

---

## Deployment

- **Back-End API Base URL:** [https://todo-mern-api-mu.vercel.app/](https://todo-mern-api-mu.vercel.app/)
- **API Documentation:** [Redoc Docs](https://todo-mern-api-mu.vercel.app/docs)
- **API Testing:** [Swagger Docs](https://todo-mern-api-mu.vercel.app/api-test/)
- **Front-End Application:** [https://todo-mern-client-amber.vercel.app/](https://todo-mern-client-amber.vercel.app/)

---

## Installation

### Prerequisites

- Node.js (>=18.x)
- Docker (Optional)

### For running locally (server)

```bash
git clone https://github.com/bifinbabu/todo-mern
cd server

(Running with docker)
docker-compose build
docker-compose up

(Running locally)
npm install
npm run dev

```

## API Endpoints

| Method | Endpoint   | Description          |
| ------ | ---------- | -------------------- |
| GET    | /tasks     | Fetch all tasks.     |
| POST   | /tasks     | Add a new task.      |
| PUT    | /tasks/:id | Update a task by ID. |
| DELETE | /tasks/:id | Delete a task by ID. |

### For running locally (client)

```bash
git clone https://github.com/bifinbabu/todo-mern
cd client

npm install
npm run dev

```

### Folder structure

.
├── client/  
├── server/  
├── README.md # Project documentation

## Contact

For any questions or feedback, feel free to reach out:

- **Name**: Bifin Babu
- **Email**: bifinbabu088@gmail.com
- **LinkedIn**: [Bifin Babu's LinkedIn](https://www.linkedin.com/in/bifinbabu088/)
