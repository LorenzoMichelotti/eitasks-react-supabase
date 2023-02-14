import Task from "@/models/Task";
import { AnimatePresence, motion } from "framer-motion";
import { toASCII } from "punycode";
import toast from "react-hot-toast";
import { create } from "zustand";

interface TaskState {
  tasks: Task[];
  save: (tasks: Task[]) => void;
  load: () => void;
  setTasks: (tasks: Task[]) => void;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  load: () => set((state: TaskState) => ({ ...state, tasks: load() })),
  save: (tasks: Task[]) => save(tasks),
  setTasks: (tasks: Task[]) => {
    save(tasks);
    set((state: TaskState) => ({
      ...state,
      tasks,
    }));
  },
}));

function save(tasks: Task[]) {
  console.log("saving...");
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
  console.log("saved.");
}

function load() {
  const loadedTasks = window.localStorage.getItem("tasks");
  if (!loadedTasks || loadedTasks === "undefined") {
    console.log("no save data found.");
    return [];
  }
  if (loadedTasks === "[]") {
    console.log("found save data with no tasks to load.");
    return [];
  }
  toast.success("data was loaded", {
    id: "task-loader-toast",
    duration: 2000,
    style: {
      color: "white",
      backgroundColor: "#1B1B22",
    },
  });
  return JSON.parse(loadedTasks);
}

export default useTaskStore;
