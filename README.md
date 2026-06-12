# Personal Blog API

This is a RESTful API built for a Personal Blog, designed to demonstrate secure backend development using Node.js, Express, TypeScript, and PostgreSQL via TypeORM.

## Database Choice

**PostgreSQL** was chosen for this project because:
1. **Relational Data Integrity:** The relationship between `Users` and `Posts` is fundamentally relational (One-To-Many). PostgreSQL excels at enforcing these strict data types, relationships, and referential integrity (e.g., `CASCADE` deletes).
2. **TypeORM Integration:** TypeORM provides excellent support for PostgreSQL, making it simple to map TypeScript classes directly to SQL tables while gaining the benefit of type safety.
3. **Scalability:** PostgreSQL is robust, ACID-compliant, and highly scalable for production workloads.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally.

### 2. Installation
Clone the repository, then install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` (or create a new `.env` file) and fill in your details:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=personal_blog_db
JWT_SECRET=super_secret_jwt_key_please_change_me
PORT=3000
```

### 4. Database Setup
Make sure you create the local database matching your `DB_NAME` prior to running the app:
```bash
# Example if using psql:
createdb -U your_postgres_username personal_blog_db
```
*Note: Due to `synchronize: true` in `src/data-source.ts`, the database tables (`user`, `post`) will be auto-generated when the server starts.*

### 5. Running the Application
To run the server in development mode (with auto-reload):
```bash
npm run dev
```

---

## Implemented Endpoints

### API Documentation (Swagger)
Interactive API documentation is available at **`http://localhost:3000/api-docs`** when the server is running.

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Registers a new user | No |
| `POST` | `/auth/login` | Authenticates a user and returns a JWT | No |

### Post Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/posts` | Retrieves a list of all posts along with their authors | No |
| `POST` | `/posts` | Creates a new post linked to the logged-in user | Yes |
| `PATCH` | `/posts/:id` | Updates a post (Requires ownership) | Yes |
| `DELETE` | `/posts/:id` | Deletes a post (Requires ownership) | Yes |