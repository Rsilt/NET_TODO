using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Data;
using System.Text.Json.Serialization;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

if (File.Exists("../.env"))
{
    DotNetEnv.Env.Load("../.env");
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});

var databasePath = Environment.GetEnvironmentVariable("DATABASE_PATH") ?? "todo.db";
builder.Services.AddDbContext<TodoContext>(options =>
    options.UseSqlite($"Data Source={databasePath}"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNameCaseInsensitive = true;
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

var app = builder.Build();

await ApplyMigrationsAndSeedAsync(app);

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/api/todos", async (
    [FromQuery] bool? done,
    [FromQuery] string? search,
    [FromQuery] string? dueDate,
    TodoContext db) =>
{
    var query = db.TodoItems.AsQueryable();

    if (done.HasValue)
        query = query.Where(t => t.IsDone == done.Value);

    if (!string.IsNullOrWhiteSpace(search))
    {
        var lowerSearch = search.ToLower();
        query = query.Where(t => t.Description.ToLower().Contains(lowerSearch));
    }

    if (!string.IsNullOrWhiteSpace(dueDate) && DateTime.TryParse(dueDate, out var date))
    {
        query = query.Where(t => t.DueDate.Date == date.Date);
    }

    var todos = await query.ToListAsync();
    return Results.Ok(todos);
});

app.MapPost("/api/todos", async (TodoItem newTodo, TodoContext db) =>
{
    db.TodoItems.Add(newTodo);
    await db.SaveChangesAsync();
    return Results.Created($"/api/todos/{newTodo.Id}", newTodo);
});

app.MapPut("/api/todos/{id}", async (int id, TodoItem updatedTodo, TodoContext db) =>
{
    var todo = await db.TodoItems.FindAsync(id);
    if (todo == null) return Results.NotFound();

    todo.Description = updatedTodo.Description;
    todo.DueDate = updatedTodo.DueDate;
    todo.IsDone = updatedTodo.IsDone;

    await db.SaveChangesAsync();
    return Results.Ok(todo);
});

app.MapDelete("/api/todos/{id}", async (int id, TodoContext db) =>
{
    var todo = await db.TodoItems.FindAsync(id);
    if (todo == null) return Results.NotFound();

    db.TodoItems.Remove(todo);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

static async Task ApplyMigrationsAndSeedAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<TodoContext>();
    await db.Database.MigrateAsync();

    if (!db.TodoItems.Any())
    {
        db.TodoItems.AddRange(
            new TodoItem { Description = "Buy groceries", DueDate = DateTime.Now.AddDays(2), IsDone = false },
            new TodoItem { Description = "Finish report", DueDate = DateTime.Now.AddDays(5), IsDone = false },
            new TodoItem { Description = "Call Alice", DueDate = DateTime.Now.AddDays(1), IsDone = true }
        );
        await db.SaveChangesAsync();
    }
}
