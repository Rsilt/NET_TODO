import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDueDate, setFilterDueDate] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  const fetchTodos = async (filters = {}) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== "all")
        params.append("done", filters.status === "done");
      if (filters.dueDate) params.append("dueDate", filters.dueDate);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();
      setTodos(data);
    } catch {
      setError("Failed to fetch todos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!description || !dueDate) return;

    const newTodo = { description, dueDate, isDone: false };
    setError("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      const savedTodo = await response.json();
      setTodos((prev) => [...prev, savedTodo]);
      setDescription("");
      setDueDate("");
    } catch {
      setError("Failed to add todo.");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    const prevTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    } catch {
      setError("Failed to delete todo.");
      setTodos(prevTodos); // rollback
    }
  };

  const handleUpdateTodo = async () => {
    if (!editTodo) return;
    setError("");
    const updatedTodo = {
      ...editTodo,
      isDone: todos.find((t) => t.id === editTodo.id).isDone,
    };
    const prevTodos = [...todos];
    setTodos((prev) =>
      prev.map((t) => (t.id === editTodo.id ? updatedTodo : t))
    );
    setEditTodo(null);

    try {
      await fetch(`${API_URL}/${editTodo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
      });
    } catch {
      setError("Failed to update todo.");
      setTodos(prevTodos); // rollback
    }
  };

  const toggleDone = async (todo) => {
    setError("");
    const updated = { ...todo, isDone: !todo.isDone };
    const prevTodos = [...todos];
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));

    try {
      await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch {
      setError("Failed to toggle status.");
      setTodos(prevTodos); // rollback
    }
  };

  const applyFilters = () => {
    fetchTodos({
      status: filterStatus,
      dueDate: filterDueDate,
      search: filterSearch,
    });
  };

  const TodoItem = ({ todo }) => (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "0.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        backgroundColor: todo.isDone ? "#e0ffe0" : "#fff",
      }}
    >
      {editTodo?.id === todo.id ? (
        <div>
          <input
            type="text"
            value={editTodo.description}
            onChange={(e) =>
              setEditTodo({ ...editTodo, description: e.target.value })
            }
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <input
            type="date"
            value={editTodo.dueDate}
            onChange={(e) =>
              setEditTodo({ ...editTodo, dueDate: e.target.value })
            }
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={handleUpdateTodo} style={{ flex: 1 }}>
              Save
            </button>
            <button onClick={() => setEditTodo(null)} style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>{todo.description}</h3>
          <p style={{ margin: "0.25rem 0" }}>
            Created At: {new Date(todo.createdAt).toLocaleString()}
          </p>
          <p style={{ margin: "0.25rem 0" }}>Due Date: {todo.dueDate}</p>
          <p style={{ margin: "0.25rem 0" }}>
            Status: {todo.isDone ? "Done" : "Not Done"}
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => toggleDone(todo)} style={{ flex: 1 }}>
              Mark as {todo.isDone ? "Not Done" : "Done"}
            </button>
            <button
              onClick={() =>
                setEditTodo({
                  id: todo.id,
                  description: todo.description,
                  dueDate: todo.dueDate,
                })
              }
              style={{ flex: 1 }}
            >
              Edit
            </button>
            <button onClick={() => handleDelete(todo.id)} style={{ flex: 1 }}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>Todo List</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Add new todo */}
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ flex: "1 1 200px", minWidth: "150px" }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ flex: "1 1 150px", minWidth: "150px" }}
        />
        <button
          onClick={handleAddTodo}
          style={{
            padding: "0.5em 1em",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Add Task
        </button>
      </div>

      {/* Filter controls */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ flex: "1 1 150px", minWidth: "150px" }}
        >
          <option value="all">All</option>
          <option value="done">Done</option>
          <option value="not_done">Not Done</option>
        </select>
        <input
          type="date"
          value={filterDueDate}
          onChange={(e) => setFilterDueDate(e.target.value)}
          style={{ flex: "1 1 150px", minWidth: "150px" }}
        />
        <input
          type="text"
          placeholder="Search in description"
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          style={{ flex: "1 1 200px", minWidth: "150px" }}
        />
        <button
          onClick={applyFilters}
          style={{
            padding: "0.5em 1em",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Apply Filters
        </button>
      </div>

      {/* Todo list */}
      {loading ? (
        <p>Loading...</p>
      ) : todos.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
      )}
    </div>
  );
}

export default App;
