import Profile from "@/models/Profile";
import Task, { CreateTask } from "@/models/Task";
import supabase from "@/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { create } from "zustand";

interface TaskState {
  tasks: Task[];
  load: (
    profile: Profile,
    supabase: SupabaseClient<any, "public", any>
  ) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: CreateTask) => void;
  removeTask: (taskId: number, profileId: number) => void;
  profile?: Profile;
  loadProfile: (profile: Profile) => void;
  updateTask: (task: Task) => void;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  updateTask: async (task: Task) => updateTask(task),
  removeTask: async (taskId: number, profileId: number) => {
    removeTask(taskId, profileId);
    set((state) => {
      const updatedTasks = [...state.tasks];
      updatedTasks.splice(
        updatedTasks.findIndex((t) => t.id === taskId),
        1
      );
      return { ...state, tasks: updatedTasks };
    });
  },
  addTask: async (task: CreateTask) => createTask(task),
  load: async (
    profile: Profile,
    supabase: SupabaseClient<any, "public", any>
  ) => {
    const tasks = await load(profile, supabase);
    set((state: TaskState) => {
      return { ...state, tasks };
    });
  },
  setTasks: (tasks: Task[]) => {
    set((state: TaskState) => ({
      ...state,
      tasks,
    }));
  },
  loadProfile: (profile: Profile) =>
    set((state: TaskState) => ({ ...state, profile })),
}));

async function load(
  profile: Profile,
  supabase: SupabaseClient<any, "public", any>
) {
  let { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("profileId", profile?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  if (!tasks) {
    console.log("no save data found.");
    return [];
  }

  if (tasks.length < 0) {
    console.log("found save data with no tasks to load.");
    return [];
  }

  console.log("tasks loaded successfully");
  console.log(tasks);

  return tasks as Task[];
}

async function removeTask(taskId: number, profileId: number) {
  if (!taskId || !profileId) {
    toast.error("Error deleting task!");
    return;
  }
  toast.loading("Deleting task...", { id: "delete-task-toast" });
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("profileId", profileId);
  if (error)
    return toast.error("Error deleting task!", { id: "delete-task-toast" });
  toast.success("The task was deleted", { id: "delete-task-toast" });
  return;
}

async function createTask(task: CreateTask) {
  if (!task) {
    toast.error("Error creating task!");
    return;
  }
  toast.loading("Creating task...", { id: "create-task-toast" });

  let newTask: CreateTask = {
    progress: task.progress,
    description: task.description,
    profileId: task.profileId,
  };

  if (task.parentTaskId) newTask.parentTaskId = task.parentTaskId;

  const { error } = await supabase.from("tasks").insert([newTask]);
  if (error)
    return toast.error("Error creating task!", { id: "create-task-toast" });
  return toast.success("The task was created", { id: "create-task-toast" });
}

async function updateTask(task: Task) {
  console.log(task);
  if (!task) return toast.error("Error updating task!");
  const { error } = await supabase
    .from("tasks")
    .update({
      progress: task.progress,
      completed: task.completed,
    })
    .eq("id", task.id);
  if (error) return toast.error("Error updating task!");
}

export default useTaskStore;
