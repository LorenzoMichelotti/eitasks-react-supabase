import useTaskStore from "@/hooks/UseTaskStore";
import Task, { CreateTask } from "@/models/Task";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export default function TaskForm({
  parentTaskId,
  isOpen = true,
  setIsOpen,
}: {
  parentTaskId?: number;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { tasks, setTasks, addTask, profile } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
    addTask: state.addTask,
    profile: state.profile,
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
      const a = Promise.resolve(createSubTask(parentTaskId, description));
      toast.promise(a, {
        loading: "Creating sub-task...",
        error: "Error while creating sub-task.",
        success: "New sub-task created.",
      });
      return;
    }
    createTask(uniqueId);
  }

  function createTask(uniqueId: string) {
    if (!profile) {
      toast.error("Profile error");
      return;
    }
    const newTask: CreateTask = {
      description,
      progress: 0,
      profileId: profile.id,
    };
    addTask(newTask);
    setDescription("");
  }

  function createSubTask(parentTaskId: number, description: string) {
    console.log("Creating subtask...");
    if (!profile) {
      console.log("Profile error");
      toast.error("Profile error");
      return;
    }
    const subtask: CreateTask = {
      description,
      progress: 0,
      parentTaskId: parentTaskId,
      profileId: profile.id,
    };
    addTask(subtask);
    setIsOpen && setIsOpen(false);
    setDescription("");
  }

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
          className="w-full mx-auto transition-transform h-24 flex space-x-2"
          id="task_form_container"
        >
          <input
            ref={inputRef}
            value={description}
            placeholder="New task title"
            onChange={(e) => {
              e.preventDefault();
              setDescription(e.target.value);
              e.stopPropagation();
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && create(description)
            }
            className="text-slate-900 placeholder:text-placeholder placeholder:font-semibold text-center flex items-center dark:text-white py-2 px-4 text-md resize-none w-10/12 h-full bg-white border-2 dark:border-none dark:bg-brand-dark rounded-l-xl rounded-r-md"
          ></input>
          <motion.button
            onClick={() => create(description)}
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
