import { useEffect, useState } from "react";

import {
  getTasks,
  createTaskRequest,
  completeTaskRequest,
  deleteTaskRequest,
  editTaskRequest,
} from "../services/api";

import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import EditTaskModal from "../components/EditTaskModal";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [editingTask, setEditingTask] = useState(null);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskFrequency, setTaskFrequency] = useState("once");

  const [taskPriority, setTaskPriority] = useState("medium");

  const [taskCategory, setTaskCategory] = useState("other");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();

      const sortedTasks = data.sort((a, b) => {
        const priorityOrder = {
          high: 3,
          medium: 2,
          low: 1,
        };

        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      setTasks(sortedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      await createTaskRequest({
        title: taskTitle,
        notes: taskNotes,
        dueDate: taskDueDate,
        frequency: taskFrequency,
        priority: taskPriority,
        category: taskCategory,
      });

      setTaskTitle("");
      setTaskNotes("");
      setTaskDueDate("");
      setTaskFrequency("once");
      setTaskPriority("medium");
      setTaskCategory("other");

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const completeTask = async (id) => {
    try {
      await completeTaskRequest(id);

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskRequest(id);

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSave = async (updatedTask) => {
    try {
      await editTaskRequest(editingTask._id, updatedTask);

      setEditingTask(null);

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const visibleTasks = tasks.filter((task) => !task.completed);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Tasks</h2>

          <p className="text-muted mb-0">Manage your productivity workflow.</p>
        </div>
      </div>

      <TaskForm
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        taskNotes={taskNotes}
        setTaskNotes={setTaskNotes}
        taskDueDate={taskDueDate}
        setTaskDueDate={setTaskDueDate}
        taskFrequency={taskFrequency}
        setTaskFrequency={setTaskFrequency}
        taskPriority={taskPriority}
        setTaskPriority={setTaskPriority}
        taskCategory={taskCategory}
        setTaskCategory={setTaskCategory}
        createTask={createTask}
      />

      <div className="row g-4">
        {visibleTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            completeTask={completeTask}
            deleteTask={deleteTask}
            openEditModal={setEditingTask}
          />
        ))}
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

export default Tasks;
