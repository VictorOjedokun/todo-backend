const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL }));

// ── In-memory store ──────────────────────────────────────────
let todos = [
  { id: uuidv4(), title: "Buy groceries", completed: false },
  { id: uuidv4(), title: "Read a book",   completed: true  },
];

// ── Routes ───────────────────────────────────────────────────

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: "Title required" });
  const todo = { id: uuidv4(), title: title.trim(), completed: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put("/api/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: "Not found" });
  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title.trim();
  if (completed !== undefined) todo.completed = completed;
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const index = todos.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  todos.splice(index, 1);
  res.status(204).send();
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
