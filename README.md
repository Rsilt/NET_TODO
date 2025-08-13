Thought Process and Technology Choices
.NET 8 / ASP.NET Core – Modern, high-performance framework for building RESTful APIs with minimal boilerplate, strong typing, and built-in dependency injection. Powers the backend API.

SQLite – Lightweight, file-based database requiring no complex setup. Stores todos persistently in todo.db.

Entity Framework Core (EF Core) – ORM simplifies database operations, supports migrations, strongly typed queries, and data seeding. Handles CRUD operations. Main idea was to use it for subnesting the bonus task. 

Docker & Docker Compose – Ensures consistent environments. Containerizes backend and frontend for easy startup with a single command.

Swagger (OpenAPI) – Interactive UI for testing and documenting API endpoints.

.env configuration – Keeps sensitive configuration like database paths separate from code, improving security and flexibility.

React (Frontend) – Provides a modern, responsive, and dynamic UI that integrates smoothly with the API.

Overall: Chosen for simplicity, portability, and maintainability, making the project easy to run, test, and deploy anywhere.

## SETUP INSTRUCTIONS 
1. Clone the repository
First, clone the repository and navigate into it:

git clone https://github.com/Rsilt/NET_TODO.git
cd NET_TODO

2. Backend Setup
Navigate to the backend folder:

cd backend/TodoApi

Restore NuGet packages with:

dotnet restore

Apply any pending migrations. This will create the SQLite database automatically:

dotnet ef database update

Run the API locally using:

dotnet run

You can access the Swagger UI for testing at:
https://localhost:7263/swagger/index.html

* The port may vary.

3. Running with Docker
Make sure Docker Desktop is running. From the project root, run:

docker-compose up --build

This will start the backend and frontend containers, ready to use.


***
Environment Variables: The backend uses a .env file for configuration. Make sure to provide DATABASE_PATH if needed.

Database: SQLite is used for simplicity. The database file is todo.db.

There is also a test-todos.sh file to test CRUD. 
