import { useEffect, useMemo, useState } from "react";
import {
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setErrorMsg("");

      const data = await getMyTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setDueDate("");
    setEditingTaskId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }

    const payload = { title, description, status, dueDate };

    try {
      if (editingTaskId) {
        const updated = await updateTask(editingTaskId, payload);
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTaskId ? updated : t))
        );
      } else {
        const created = await createTask(payload);
        setTasks((prev) => [...prev, created]);
      }

      resetForm();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to save task.");
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setStatus(task.status || "TODO");
    setDueDate(task.dueDate || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTaskId === id) resetForm();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to delete task.");
    }
  };

  const formatStatus = (value) => {
    if (value === "IN_PROGRESS") return "In progress";
    if (value === "DONE") return "Done";
    return "Todo";
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const da = a.dueDate ? new Date(a.dueDate) : new Date("9999-12-31");
      const db = b.dueDate ? new Date(b.dueDate) : new Date("9999-12-31");
      return da - db;
    });
  }, [tasks]);

  if (loading) {
    return <p className="container">Loading tasks…</p>;
  }

  return (
    <main className="page tasks-page">
      <div className="container">
        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <div className="tasks-grid">
          {/* LEFT CARD */}
          <section className="card task-form-card">
            <form onSubmit={handleSubmit} className="task-form">
              <label className="form-field">
                <span>Title</span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>

              <label className="form-field">
                <span>Description</span>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </label>

              <label className="form-field">
                <span>Status</span>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="DONE">Done</option>
                </select>
              </label>

              <label className="form-field">
                <span>Due date</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </label>

              <div className="task-form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingTaskId ? "Save changes" : "Create task"}
                </button>

                {editingTaskId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* RIGHT CARD */}
          <section className="card tasks-list-card">
            {sortedTasks.length === 0 ? (
              <div className="empty-state">
                <p className="empty-title">You don’t have any tasks yet</p>
                <p className="empty-subtitle">
                  Create your first task using the form on the left to get started.
                </p>
              </div>
            ) : (
              <ul className="tasks-list">
                {sortedTasks.map((task) => (
                  <li key={task.id} className="task-item">
                    <div className="task-main">
                      <div className="task-title">{task.title}</div>

                      <div className="task-meta">
                        Status{" "}
                        <span className={`badge badge-${task.status}`}>
                          {formatStatus(task.status)}
                        </span>
                        {task.dueDate && <> • Due: {task.dueDate}</>}
                      </div>

                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                    </div>

                    <div className="task-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Tasks;


