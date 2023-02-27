import Profile from "@/models/Profile";
import Task, { CreateTask } from "@/models/Task";
import supabase from "@/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { create } from "zustand";

interface TaskState {
  tasks: Task[];
  taskCount: number;
  activeTask?: Task;
  setActiveTask: (task?: Task) => void;
  load: (
    profile: Profile,
    supabase: SupabaseClient<any, "public", any>,
    page?: number,
    maxPerPage?: number
  ) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: CreateTask) => void;
  removeTask: (taskId: number, profileId: number) => void;
  profile?: Profile;
  loadProfile: (profile: Profile) => void;
  updateTask: (task: Task) => void;
  getSubtasks: (
    taskId: number,
    profileId: number
  ) => Promise<{ subtasks: Task[]; count: number }>;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  taskCount: 0,
  setActiveTask: (task?: Task) => {
    set((state) => ({ ...state, activeTask: task || undefined }));
  },
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
    supabase: SupabaseClient<any, "public", any>,
    page: number = 1,
    maxPerPage: number = 5
  ) => {
    const data = await load(profile, supabase, page, maxPerPage);
    if (data)
      set((state: TaskState) => {
        // const currentActiveTask = state.activeTask;
        // let updatedActiveTask;
        // if (currentActiveTask)
        //   updatedActiveTask = data.tasks?.find(
        //     (t) => t.id === currentActiveTask.id
        //   );
        return {
          ...state,
          tasks: data.tasks,
          taskCount: data.count ?? 0,
          // activeTask: updatedActiveTask,
        };
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
  getSubtasks: (taskId: number, profileId: number) =>
    getSubtasks(taskId, profileId),
}));

async function load(
  profile: Profile,
  supabase: SupabaseClient<any, "public", any>,
  page: number = 1,
  maxPerPage: number = 5
) {
  let maxRange = maxPerPage;
  if (page === 1) {
    maxRange -= 1;
  }

  let {
    data: tasks,
    count,
    error,
  } = await supabase
    .from("tasks")
    .select("*", { count: "exact" })
    .eq("profileId", profile?.id)
    .is("parentTaskId", null)
    .order("created_at", { ascending: false })
    .range((page - 1) * maxRange, maxRange);

  if (error) {
    console.log(error);
    return { tasks: [], count: 0 };
  }

  if (!tasks) {
    console.log("no save data found.");
    return { tasks: [], count: 0 };
  }

  if (tasks.length < 0) {
    console.log("found save data with no tasks to load.");
    return { tasks: [], count: 0 };
  }

  console.log("tasks loaded successfully");

  return { tasks: tasks as Task[], count: count };
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
    title: task.title,
    profileId: task.profileId,
  };

  if (task.parentTaskId) newTask.parentTaskId = task.parentTaskId;

  const { error } = await supabase.from("tasks").insert([newTask]);
  if (error)
    return toast.error("Error creating task!", { id: "create-task-toast" });
  return toast.success("The task was created", { id: "create-task-toast" });
}

async function updateTask(task: Task) {
  if (!task) return toast.error("Error updating task!");
  const { error } = await supabase
    .from("tasks")
    .update({
      progress: task.progress,
      completed: task.completed,
      title: task.title,
      description: task.description,
    })
    .eq("id", task.id);
  if (error) return toast.error("Error updating task!");
  else
    return toast.success("The task was updated.", {
      id: "updating-task-toast",
    });
}

async function getSubtasks(
  taskId: number,
  profileId: number
): Promise<{ subtasks: Task[]; count: number }> {
  let {
    data: subtasks,
    count,
    error,
  } = await supabase
    .from("tasks")
    .select("*", { count: "exact" })
    .eq("profileId", profileId)
    .eq("parentTaskId", taskId)
    .order("created_at", { ascending: false });

  if (error || !subtasks) {
    console.log(error);
    return { subtasks: [], count: 0 };
  }

  return { subtasks: subtasks as Task[], count: count ?? 0 };
}

export default useTaskStore;
