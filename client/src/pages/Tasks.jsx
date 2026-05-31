import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

function Tasks({
  token,
  tasks,
  taskTitle,
  setTaskTitle,
  taskDueDate,
  setTaskDueDate,
  createTask,
  completeTask,
  deleteTask,
  taskFrequency,
  setTaskFrequency,
}) {
  return (
    <section className="container py-5 px-4">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-5">
          <h2 className="fw-bold mb-2">Task Management</h2>

          <p className="text-muted">
            Create tasks, mark them complete, and manage your daily work.
          </p>

          {!token && (
            <div className="alert alert-warning">
              No login token found. Please log in first so tasks can load.
            </div>
          )}

          <TaskForm
            taskTitle={taskTitle}
            setTaskTitle={setTaskTitle}
            taskDueDate={taskDueDate}
            setTaskDueDate={setTaskDueDate}
            taskFrequency={taskFrequency}
            setTaskFrequency={setTaskFrequency}
            createTask={createTask}
          />

          {tasks.length === 0 ? (
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
