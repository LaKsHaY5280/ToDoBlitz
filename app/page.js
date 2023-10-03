"use client";

import { XCircle } from "lucide-react";
import { useState, useEffect } from "react";

function page({ initialData = [] }) {
  const [data, setData] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const tasksFromLocalStorage = window.localStorage.getItem("tasks");
      return tasksFromLocalStorage ? JSON.parse(tasksFromLocalStorage) : [];
    }
    return [];
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== "undefined" && window.localStorage) {
      const tasksFromLocalStorage = window.localStorage.getItem("tasks");
      if (tasksFromLocalStorage) {
        setData(JSON.parse(tasksFromLocalStorage));
      }
    }
  }, [isClient]);

  const [filteredData, setFilteredData] = useState(initialData);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("tasks", JSON.stringify(data));
    }
  }, [data]);

  // const addTask = (name) => {
  //   const newTask = { id: Date.now(), name, completed: false };
  //   setData([...data, newTask]);
  // };

  const addTask = (name) => {
    const newTask = { id: Date.now(), name, completed: false };
    setData([...data, newTask]);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("tasks", JSON.stringify([...data, newTask]));
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    addTask(newTaskName);
    setNewTaskName("");
  };

  // const deleteTask = (id) => {
  //   setData(data.filter((task) => task.id !== id));
  // };

  const deleteTask = (id) => {
    const updatedData = data.filter((task) => task.id !== id);
    setData(updatedData);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("tasks", JSON.stringify(updatedData));
    }
  };

  // const toggleStatus = (id) => {
  //   setData(
  //     data.map((task) =>
  //       task.id === id ? { ...task, completed: !task.completed } : task
  //     )
  //   );
  // };

  const toggleStatus = (id) => {
    const updatedData = data.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setData(updatedData);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("tasks", JSON.stringify(updatedData));
    }
  };

  const filterData = (completed) => {
    if (completed === null) {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((task) => task.completed === completed));
    }
  };

  const today = new Date();
  const day = today.toLocaleString("default", { weekday: "short" });
  const date = today.getDate();
  const month = today.toLocaleString("default", { month: "short" });
  const year = today.getFullYear();

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="p-5 mx-auto bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-xl font-semibold text-slate-700">{`${day}, ${date} ${month} ${year}`}</h1>
        <h4 className="mb-4 text-sm text-slate-600 ">
          {isClient ? `${data.length} tasks` : "Loading tasks..."}
        </h4>
        {/* Task input form */}
        <form onSubmit={handleFormSubmit} className="flex mb-4">
          <input
            type="text"
            value={newTaskName}
            name="taskadder"
            id="taskadder"
            onChange={(e) => setNewTaskName(e.target.value)}
            className="px-2 py-1 mr-2 text-sm text-gray-700 bg-transparent border-b border-gray-400 focus:border-b-2 focus:border-gray-700"
            placeholder="Add a new task..."
          />

          <button
            name="tasksubmiter"
            id="tasksubmiter"
            type="submit"
            className="!px-7 !py-3 text-sm btn"
          >
            Add
          </button>
        </form>

        {/* Task filters */}
        <div className="mb-4 space-x-2">
          <button
            onClick={() => filterData(null)}
            className="px-2 py-1 text-sm btn "
          >
            All
          </button>
          <button
            onClick={() => filterData(false)}
            className="px-2 py-1 text-sm btn "
          >
            Active
          </button>
          <button
            onClick={() => filterData(true)}
            className="px-2 py-1 text-sm btn "
          >
            Completed
          </button>
        </div>

        {/* Task list */}
        {filteredData.length > 0 ? (
          filteredData.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between mb-2 bg-gray-100 rounded shadow py-2"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleStatus(task.id)}
                  className="m-2 task-status"
                />
                <span
                  className={`${
                    task.completed ? "line-through text-gray-500" : ""
                  } list`}
                >
                  {task.name}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="px-2 py-1 text-sm text-white rounded"
              >
                <XCircle
                  size={24}
                  color="#4fc08d"
                  strokeWidth={1}
                  absoluteStrokeWidth
                />
              </button>
            </div>
          ))
        ) : (
          <p>No tasks to display</p>
        )}
      </div>
    </div>
  );
}

export default page;
