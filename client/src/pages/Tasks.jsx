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
  const [taskFrequency, setTaskFrequency] = useState("daily");
  const [loading, setLoading] = useState(true);

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
      });

      setTasks([newTask, ...tasks]);
      setTaskTitle("");
      setTaskDueDate("");
      setTaskFrequency("daily");
      toastr.success("Task created.");
    } catch (error) {
      console.error(error);
      toastr.error("Unable to create task.");
    }
  };

  const completeTask = async (id) => {
    try {
      const updatedTask = await completeTaskRequest(id);

      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      console.error(error);
      toastr.error("Unable to update task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskRequest(id);
      setTasks(tasks.filter((task) => task._id !== id));
      toastr.success("Task deleted.");
    } catch (error) {
      console.error(error);
      toastr.error("Unable to delete task.");
    }
  };

  return (
    <section className="container py-5 px-4">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-5">
          <h2 className="fw-bold mb-2">Task Management</h2>

          <p className="text-muted">
            Create tasks, mark them complete, and manage your daily work.
          </p>

          <TaskForm
            taskTitle={taskTitle}
            setTaskTitle={setTaskTitle}
            taskDueDate={taskDueDate}
            setTaskDueDate={setTaskDueDate}
            taskFrequency={taskFrequency}
            setTaskFrequency={setTaskFrequency}
            createTask={createTask}
          />

          {loading ? (
            <p className="text-muted">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-muted">No tasks yet. Add one above.</p>
          ) : (
            <div className="row">
              {tasks.map((task) => (
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
