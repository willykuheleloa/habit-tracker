import { useEffect, useState } from "react";
import toastr from "toastr";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import {
  getTasks,
  createTaskRequest,
  completeTaskRequest,
  deleteTaskRequest,
} from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskFrequency, setTaskFrequency] = useState("once");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskCategory, setTaskCategory] = useState("other");
  const [taskNotes, setTaskNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("active");
  const [sortMode, setSortMode] = useState("priority");

  const priorityOrder = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
      toastr.error("Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();

    try {
      const newTask = await createTaskRequest({
        title: taskTitle,
        dueDate: taskDueDate,
        frequency: taskFrequency,
        priority: taskPriority,
        category: taskCategory,
        notes: taskNotes,
      });

      setTasks([newTask, ...tasks]);

      setTaskTitle("");
      setTaskDueDate("");
      setTaskFrequency("once");
      setTaskPriority("medium");
      setTaskCategory("other");
      setTaskNotes("");

      toastr.success("Task created.");
    } catch (error) {
      console.error(error);
      toastr.error("Unable to create task.");
    }
  };

  const completeTask = async (id) => {
    try {
      const updatedTask = await completeTaskRequest(id);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === id ? updatedTask : task)),
      );
    } catch (error) {
      console.error(error);
      toastr.error("Unable to update task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskRequest(id);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id),
      );

      toastr.success("Task deleted.");
    } catch (error) {
      console.error(error);
      toastr.error("Unable to delete task.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    if (filter === "high") return task.priority === "high";
    if (filter === "medium") return task.priority === "medium";
    if (filter === "low") return task.priority === "low";

    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortMode === "priority") {
      return (
        (priorityOrder[b.priority || "medium"] || 2) -
        (priorityOrder[a.priority || "medium"] || 2)
      );
    }

    if (sortMode === "dueDate") {
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date("9999-12-31");

      const dateB = b.dueDate ? new Date(b.dueDate) : new Date("9999-12-31");

      return dateA - dateB;
    }

    return 0;
  });

  return (
    <section className="container py-5 px-4">
      <div className="dashboard-hero mb-4">
        <div>
          <p className="text-uppercase fw-semibold text-primary mb-2">
            Task Manager
          </p>

          <h1 className="fw-bold mb-2">Tasks</h1>

          <p className="text-muted mb-0">
            Organize your work by due date, priority, category, and completion
            status.
          </p>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4 p-md-5">
          <TaskForm
            taskTitle={taskTitle}
            setTaskTitle={setTaskTitle}
            taskDueDate={taskDueDate}
            setTaskDueDate={setTaskDueDate}
            taskFrequency={taskFrequency}
            setTaskFrequency={setTaskFrequency}
            taskPriority={taskPriority}
            setTaskPriority={setTaskPriority}
            taskCategory={taskCategory}
            setTaskCategory={setTaskCategory}
            taskNotes={taskNotes}
            setTaskNotes={setTaskNotes}
            createTask={createTask}
          />

          <div className="task-toolbar mb-4">
            <div className="d-flex flex-wrap gap-2">
              {["active", "completed", "high", "medium", "low"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`btn btn-sm rounded-pill ${
                    filter === item ? "btn-dark" : "btn-outline-secondary"
                  }`}
                  onClick={() => setFilter(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>

            <select
              className="form-select rounded-pill task-sort-select"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
            >
              <option value="priority">Sort by Priority</option>

              <option value="dueDate">Sort by Due Date</option>
            </select>
          </div>

          {loading ? (
            <p className="text-muted">Loading tasks...</p>
          ) : sortedTasks.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="fw-bold">No tasks found</h4>

              <p className="text-muted mb-0">
                Add a new task or change your filters.
              </p>
            </div>
          ) : (
            <div className="row g-4 mt-2">
              {sortedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  completeTask={completeTask}
                  deleteTask={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Tasks;
