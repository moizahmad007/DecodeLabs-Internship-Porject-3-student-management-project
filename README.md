# Student Management System — DecodeLabs Project 3

A MERN full-stack CRUD application built around the requirements in `Full Stack P3.pdf`:
- Design a simple database schema
- Connect the backend to persistent database storage
- Implement Create, Read, Update and Delete
- Use RESTful HTTP methods
- Validate data and enforce integrity at the schema level
- Handle errors safely

## Stack
React + Vite, Tailwind CSS, Node.js, Express, MongoDB Atlas, Mongoose.

## 1. Requirements
Install Node.js 20+ and npm. Create a free MongoDB Atlas cluster or use a local MongoDB server.

## 2. Configure the backend
```powershell
cd backend
Copy-Item .env.example .env
```
Open `backend/.env` and set `MONGODB_URI` to your MongoDB connection string. For Atlas, replace the username, password and database name. Do not commit `.env`.

```powershell
npm install
npm run dev
```
Backend runs at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

## 3. Configure the frontend
Open a second PowerShell terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## 4. CRUD API
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/students` | Create a student |
| GET | `/api/students` | Read all students |
| GET | `/api/students/:id` | Read one student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

Example request body:
```json
{
  "name": "Ayesha Khan",
  "email": "ayesha@example.com",
  "course": "Computer Science",
  "semester": 5
}
```

## 5. Database schema
`Student` fields:
- `name`: required string, trimmed, 2–60 characters
- `email`: required, normalized to lowercase, unique
- `course`: required string, 2–80 characters
- `semester`: required integer from 1 to 12
- timestamps: `createdAt`, `updatedAt`

MongoDB stores each student as a document in the `students` collection. Mongoose is the ODM bridge between Express application logic and MongoDB.

## 6. How the PDF requirements are covered
1. **Blueprint:** a Mongoose schema defines fields, types, required values, uniqueness and range constraints.
2. **Bridge:** Mongoose connects the Express backend to MongoDB using `MONGODB_URI`.
3. **Action:** REST endpoints map CRUD to POST, GET, PUT and DELETE.
4. **Shield:** server-side validation, unique email index, safe model operations, centralized error handling and environment-based secrets.

## 7. Suggested verification
- Add a student and confirm it appears in the table.
- Refresh the browser; the record should remain because it is stored in MongoDB.
- Edit the student's course or semester.
- Delete the student.
- Try submitting an invalid email or semester 0.
- Try creating two students with the same email; the API should reject the duplicate.

## Notes
This is a learning Project 3 focused on database integration and CRUD. Authentication, roles and deployment are intentionally outside the PDF's stated scope.
