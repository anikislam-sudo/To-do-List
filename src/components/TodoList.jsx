import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const priorityColors = {
  low: "bg-green-200",
  medium: "bg-yellow-200",
  high: "bg-red-200",
};

const getLocalStorage = () => {
  const storedTasks = window.localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
};

const TodoList = () => {
  const [tasks, setTasks] = useState(getLocalStorage());
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("low");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([
        ...tasks,
        {
          id: Math.random().toString(36).substr(2, 9),
          text: newTask,
          priority: priority,
          completed: false,
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const startEditTask = (id, text) => {
    setEditTaskId(id);
    setEditTaskText(text);
  };

  const updateTaskText = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: editTaskText } : task
    );
    setTasks(updatedTasks);
    setEditTaskId(null);
    setEditTaskText("");
  };

  const filteredTasks = priorityFilter
    ? tasks.filter((task) => task.priority === priorityFilter)
    : tasks;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Task Management</h1>
      <div className="mb-4 flex flex-col md:flex-row gap-2">
        <input
          id="enterTaskInput"
          type="text"
          className="border-gray-300 border rounded-md p-2 flex-1"
          placeholder="Enter task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select
          className="border-gray-300 border rounded-md p-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>
      <div>
        <h2 className="text-xl text-white font-bold mb-2">Tasks</h2>
        <div className="mb-4">
          <span className="font-semibold text-white">Total Tasks:</span>{" "}
          <span className="text-white">{tasks.length}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-white">Completed Tasks:</span>{" "}
          <span className="text-white">
            {tasks.filter((task) => task.completed).length}
          </span>
        </div>
        <div className="mb-4">
          <select
            className="border-gray-300 border rounded-md p-2"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-md ${priorityColors[task.priority]} border border-gray-200`}
            >
              {editTaskId === task.id ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    autoFocus
                    className="border-gray-300 border rounded-md p-2 mb-2 md:mb-0 mr-2 "
                  />
                  <button
                    onClick={() => updateTaskText(task.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md"
                  >
                    Update
                  </button>
                </div>
              ) : (
                <div>
                  <span
                    className={`cursor-pointer ${
                      task.completed && ""
                    }`}
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    {task.text}
                  </span>
                  {task.completed && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="pl-1 text-green-500"
                    />
                  )}
                </div>
              )}
              <div>
                {!task.completed && (
                  <button
                    className="text-sm text-gray-600 mr-2"
                    onClick={() => startEditTask(task.id, task.text)}
                  >
                    Edit
                  </button>
                )}
                {!task.completed && (
                  <button
                    className="text-sm text-gray-600 mr-2"
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  className="text-sm text-red-600"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
