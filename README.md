# Thought Process and Technology Choices

## Backend

I decided to use .NET 8 / ASP.NET Core because it's a modern, high-performance framework that makes building RESTful APIs straightforward. It keeps the code minimal and type-safe, with built-in dependency injection that makes development easier.

For data storage, I chose SQLite because it's lightweight and file-based, requiring no complex setup. It stores data persistently in todo.db, which simplifies deployment.

Entity Framework Core (EF Core) is my ORM of choice. It helps simplify database operations, supports migrations, and allows me to write strongly typed queries. I plan to use it especially for handling nested or complex data structures in the bonus task.

To ensure environment consistency, I containerized the entire setup using Docker and Docker Compose. This way, starting up the backend and frontend requires just a single command, making development and deployment much smoother.

For API documentation and testing, I integrated Swagger (OpenAPI). It provides an interactive UI where I can explore endpoints and test API calls easily.

Sensitive configuration details, like the database path, are stored in an .env file. This approach keeps sensitive info separate from the code, enhancing security and flexibility when configuring different environments.

## Frontend

I chose React for the frontend because it's modern, responsive, and easy for building dynamic interfaces that integrate with the backend API.

---

# NET_TODO

## Setup Instructions

### 1. Clone the repository
First, clone the repository and navigate into it:

```bash
git clone https://github.com/Rsilt/NET_TODO.git
cd NET_TODO
```

---

### 2. Backend Setup
Navigate to the backend folder:

```bash
cd backend/TodoApi
```

Restore NuGet packages:

```bash
dotnet restore
```

Apply any pending migrations (this will create the SQLite database automatically):

```bash
dotnet ef database update
```

Run the API locally:

```bash
dotnet run
```

You can access the Swagger UI for testing at:  
[https://localhost:7263/swagger/index.html](https://localhost:7263/swagger/index.html)  
*The port may vary.*

---

### 3. Running with Docker
Make sure **Docker Desktop** is running. From the project root, run:

```bash
docker-compose up --build
```

This will start the backend and frontend containers, ready to use.


***
Environment Variables: The backend uses a .env file for configuration. Make sure to provide DATABASE_PATH if needed.

Database: SQLite is used for simplicity. The database file is todo.db.

There is also a test-todos.sh file to test CRUD. 
