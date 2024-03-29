import Profile from "@/models/Profile";
import Response from "@/models/Response";
import Task, { CreateTask } from "@/models/Task";
import { SupabaseClient } from "@supabase/supabase-js";
import axios, { AxiosError } from "axios";
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
  addTask: (task: CreateTask, isSubtask: boolean) => Promise<Task | void>;
  removeTask: (
    taskId: number,
    profileId: number,
    supabase: SupabaseClient<any, "public", any>,
    isSubtask?: boolean
  ) => void;
  profile?: Profile;
  loadProfile: (profile: Profile) => void;
  updateTask: (
    task: Task,
    supabase: SupabaseClient<any, "public", any>
  ) => void;
  getSubtasks: (
    taskId: number,
    profileId: number,
    supabase: SupabaseClient<any, "public", any>
  ) => Promise<Response<{ subtasks: Task[]; count: number }>>;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  taskCount: 0,
  setActiveTask: (task?: Task) => {
    set((state) => {
      if (state.activeTask && state.activeTask.id === task?.id) return state;
      return { ...state, activeTask: task || undefined };
    });
  },
  updateTask: async (
    task: Task,
    supabase: SupabaseClient<any, "public", any>
  ) => updateTask(task, supabase),
  removeTask: async (
    taskId: number,
    profileId: number,
    supabase: SupabaseClient<any, "public", any>,
    isSubtask?: boolean
  ) => {
    removeTask(taskId, profileId, supabase);
    if (isSubtask) return;
    set((state) => {
      const updatedTasks = [...state.tasks];
      updatedTasks.splice(
        updatedTasks.findIndex((t) => t.id === taskId),
        1
      );
      return { ...state, tasks: updatedTasks };
    });
  },
  addTask: async (task: CreateTask, isSubtask: boolean) => {
    const resp = await createTask(task);
    if (!resp.success || !resp.model) return;
    const newTask = resp.model[0];
    if (isSubtask) return newTask;
    set((state) => ({ ...state, tasks: [newTask, ...state.tasks] }));
    return newTask;
  },
  load: async (
    profile: Profile,
    supabase: SupabaseClient<any, "public", any>,
    page: number = 1,
    maxPerPage: number = 5
  ) => {
    const data = await load(profile, supabase, page, maxPerPage);
    if (data)
      set((state: TaskState) => {
        const currentActiveTask = state.activeTask;
        if (currentActiveTask) {
          const updatedActiveTask = data.tasks?.find(
            (t) => t.id === currentActiveTask.id
          );
          return {
            ...state,
            tasks: data.tasks,
            taskCount: data.count,
            activeTask: updatedActiveTask,
          };
        } else
          return {
            ...state,
            tasks: data.tasks,
            taskCount: data.count,
          };
      });
  },
  setTasks: (tasks: Task[]) => {
    set((state: TaskState) => ({
      ...state,
      tasks: tasks,
    }));
  },
  loadProfile: (profile: Profile) =>
    set((state: TaskState) => ({ ...state, profile })),
  getSubtasks: (
    taskId: number,
    profileId: number,
    supabase: SupabaseClient<any, "public", any>
  ) => getSubtasks(taskId, profileId, supabase),
}));

async function load(
  profile: Profile,
  supabase: SupabaseClient<any, "public", any>,
  page: number = 1,
  maxPerPage: number = 5
) {
  let maxRange = maxPerPage;
  let startRange = page - 1;
  if (page === 1) {
    maxRange -= 1;
  }
  startRange = startRange * maxRange;
  maxRange = (page - 1) * maxRange + maxRange;
  if (page > 1) {
    maxRange -= 1;
  }

  let {
    data: tasks,
    count,
    error,
  } = await supabase
    .from("tasks")
    .select("*", { count: "exact" })
    .eq("profileId", profile.id)
    .is("parentTaskId", null)
    .order("created_at", { ascending: false })
    .range(startRange, maxRange);

  if (error) {
    console.log(error);
    return { tasks: [], count: 0 };
  }

  if (!tasks) {
    console.log("no save data found.");
    return { tasks: [], count: 0 };
  }

  if (tasks.length < 0) {
    // if there are no tasks
    console.log("found save data with no tasks to load.");
    return { tasks: [], count: 0 };
  }

  return { tasks: tasks as Task[], count: count ?? 0 };
}

async function removeTask(
  taskId: number,
  profileId: number,
  supabase: SupabaseClient<any, "public", any>
) {
  if (!taskId || !profileId) {
    toast.error("Error deleting task!");
    return;
  }
  axios
    .delete(`/api/tasks/delete/${taskId}`)
    .then((response) => {
      const data = response.data;
      if (!data.success) return toast.error(data.errors[0]);
    })
    .catch((error: AxiosError) => {
      console.log(error?.code + error.message);
      toast.error(error?.code + error.message);
    });
  return;
}

async function createTask(task: CreateTask) {
  if (!task) {
    toast.error("Error creating task!", { id: "create-task-toast" });
    return {
      errors: ["Error creating task!"],
      success: false,
    };
  }
  let newTask: CreateTask = {
    progress: task.progress,
    title: task.title,
    profileId: task.profileId,
  };

  if (task.parentTaskId) newTask.parentTaskId = task.parentTaskId;

  return axios
    .post<Response<Task[]>>(`/api/tasks/post`, newTask)
    .then((response) => {
      const data = response.data;
      if (!data.success) toast.error(data.errors[0]);
      return data;
    })
    .catch((error: AxiosError) => {
      console.log(error?.code + error.message);
      toast.error(error?.code + error.message);
      return {
        errors: [error?.code + error.message],
        success: false,
      };
    });
}

async function updateTask(
  task: Task,
  supabase: SupabaseClient<any, "public", any>
) {
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
}

async function getSubtasks(
  taskId: number,
  profileId: number,
  supabase: SupabaseClient<any, "public", any>
): Promise<Response<{ subtasks: Task[]; count: number }>> {
  return axios<Response<{ subtasks: Task[]; count: number }>>(
    `/api/subtasks/${taskId}/${profileId}`
  )
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.log(error?.code + error.message);
      toast.error(error?.code + error.message);
      return { errors: [], success: false, model: { subtasks: [], count: 0 } };
    });
}

export default useTaskStore;
