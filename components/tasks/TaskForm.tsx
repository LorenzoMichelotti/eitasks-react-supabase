import useTaskStore from "@/hooks/UseTaskStore";
import Task, { CreateTask } from "@/models/Task";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export default function TaskForm({
  parentTaskId,
  isOpen = true,
  setIsOpen,
  subtaskMode = false,
  triggerCreating,
}: {
  parentTaskId?: number;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  subtaskMode?: boolean;
  triggerCreating?: (isSubtask: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = useSupabaseClient();

  const { addTask, profile, getSubtasks, tasks, setTasks, updateTask } =
    useTaskStore((state) => ({
      addTask: state.addTask,
      profile: state.profile,
      getSubtasks: state.getSubtasks,
      tasks: state.tasks,
      setTasks: state.setTasks,
      updateTask: state.updateTask,
    }));

  function create(description: string) {
    if (description.trim() == "") {
      toast.error("Please enter task description", {
        id: "empty-task-description-toast",
        style: {
          color: "white",
          backgroundColor: "#1B1B22",
        },
      });
      return;
    }

    let uniqueId = uuidv4();

    if (parentTaskId) {
      createSubTask(parentTaskId, description);
      return;
    }
    createTask(uniqueId);
  }

  function createTask(uniqueId: string) {
    if (triggerCreating) triggerCreating(false);
    if (!profile) {
      toast.error("Profile error");
      return;
    }
    const newTask: CreateTask = {
      title,
      progress: 0,
      profileId: profile.id,
    };
    addTask(newTask, supabase);
    setTitle("");
  }

  async function createSubTask(parentTaskId: number, description: string) {
    if (!profile) return;
    // task
    const { model } = await getSubtasks(parentTaskId, profile.id, supabase);
    if (!model) return;
    const updatedTasks = [...tasks];
    const parentTask = updatedTasks.find((t) => t.id === parentTaskId);
    const updatedProgress =
      (model.subtasks.filter((t) => t.completed).length * 100) /
      (model.subtasks.length + 1);
    if (!parentTask) return;
    const updatedParentTask = { ...parentTask };
    updatedParentTask.progress = Math.round(updatedProgress);
    updatedTasks.splice(
      tasks.findIndex((t) => t.id === updatedParentTask.id),
      1,
      updatedParentTask
    );
    setTasks(updatedTasks);
    updateTask(updatedParentTask, supabase);
    // subtask
    console.log("Creating subtask...");
    if (triggerCreating) triggerCreating(true);
    if (!profile) {
      console.log("Profile error");
      toast.error("Profile error");
      return;
    }
    const subtask: CreateTask = {
      title,
      progress: 0,
      parentTaskId: parentTaskId,
      profileId: profile.id,
    };
    // update database
    addTask(subtask, supabase);
    setIsOpen && setIsOpen(false);
    setTitle("");
  }

  // function recalculateTaskProgress() {
  //   // optimistically update the parent task
  //   if (!parentTaskId) return;
  //   const updatedTasks = [...tasks];
  //   console.log("updating parent task");
  //   const parentTask = tasks.find((t) => t.id === parentTaskId);
  //   const updatedProgress =
  //     (updatedSubtasks.filter((t) => t.completed).length * 100) /
  //     updatedSubtasks.length;
  //   if (!parentTask) return;
  //   const updatedParentTask = { ...parentTask };
  //   updatedParentTask.progress = Math.round(updatedProgress);
  //   updatedTasks.splice(
  //     tasks.findIndex((t) => t.id === parentTaskId),
  //     1,
  //     updatedParentTask
  //   );
  //   setTasks(updatedTasks);
  //   // update the parent task
  //   updateTask(updatedParentTask, supabase);
  // }

  const formVariant = {
    closed: { y: -20, opacity: 0, transition: { duration: 0.2 } },
    open: { y: 0, opacity: 1, transition: { duration: 0.1 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={formVariant}
          initial={"closed"}
          animate={isOpen ? "open" : "closed"}
          exit={"closed"}
          className={`w-full mx-auto transition-transform ${
            subtaskMode ? "h-16" : "h-24"
          } flex space-x-2`}
          id="task_form_container"
        >
          <input
            ref={inputRef}
            value={title}
            placeholder={`${subtaskMode ? "New activity" : "New task"}`}
            onChange={(e) => {
              e.preventDefault();
              setTitle(e.target.value);
              e.stopPropagation();
            }}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && create(title)}
            className={`text-slate-900 placeholder:text-placeholder placeholder:font-semibold text-center flex items-center dark:text-white py-2 px-4 text-md resize-none w-10/12 h-full border-2 dark:border-none bg-white ${
              subtaskMode ? "dark:bg-brand-darkest" : "dark:bg-brand-dark"
            } rounded-l-xl rounded-r-md`}
          ></input>
          <motion.button
            onClick={() => create(title)}
            whileHover={{
              backgroundColor: "#485577",
              transition: { duration: 0.2, type: "spring" },
            }}
            whileTap={{
              backgroundColor: "#3D4062",
              scale: 0.95,
              transition: { duration: 0.2, type: "spring" },
            }}
            className="bg-sky-600 dark:bg-brand-light w-2/12 rounded-r-2xl rounded-l-md shadow-xl flex justify-center items-center"
          >
            <Image
              src={"/assets/add.svg"}
              width={42}
              height={42}
              alt="plus icon"
            ></Image>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
