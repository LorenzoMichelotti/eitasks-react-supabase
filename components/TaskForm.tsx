import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import Tasks from "@/pages";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";
import Slider from "./Slider";
import Slider2 from "./Slider2";

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
  const [progress, setProgress] = useState(0);
  const textArea = useRef<HTMLTextAreaElement>(null);

  const { tasks, setTasks } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
  }));

  function create(description: string, progress: number) {
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
    if (parentTaskId) {
      createSubTask(parentTaskId, description, progress);
      return;
    }
    createTask();
  }

  function createTask() {
    const newTask: Task = {
      created: new Date().toLocaleDateString(),
      description,
      progress: Math.round(progress),
      id: tasks.length + 1,
    };
    setTasks([newTask, ...tasks]);

    setDescription("");
    setProgress(0);
  }

  function createSubTask(
    parentTaskId: number,
    description: string,
    progress: number
  ) {
    console.log("Creating subtask...");

    const getParentTask: Task | undefined = tasks.find(
      (task) => task.id == parentTaskId
    );

    if (!getParentTask) return;

    const subtask: Task = {
      created: new Date().toLocaleDateString(),
      description,
      progress: Math.round(progress),
      id: tasks.length + 1,
      parentTaskId,
    };

    setTasks([subtask, ...tasks]);
    setIsOpen && setIsOpen(false);

    setDescription("");
    setProgress(0);
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
          className="w-full focus-within:scale-105 mt-2 transition-transform h-56 flex space-x-2"
          id="task_form_container"
        >
          <div
            className="w-10/12 bg-white dark:bg-brand-medium shadow-xl p-4 rounded-l-2xl rounded-r-md"
            id="task_form"
          >
            <textarea
              ref={textArea}
              value={description}
              onChange={(e) => {
                e.preventDefault();
                setDescription(e.target.value);
                e.stopPropagation();
              }}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                create(description, progress)
              }
              className="text-slate-900 dark:text-white py-2 px-4 text-[20px] resize-none w-full h-4/6 bg-white border-2 dark:border-none dark:bg-brand-dark rounded-xl"
            ></textarea>
            <div className="mx-2 mt-4">
              <Slider2
                thumbAlwaysVisible
                value={[progress]}
                setValue={setProgress}
                callback={() => create(description, progress)}
              />
            </div>
          </div>
          <motion.button
            onClick={() => create(description, progress)}
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
              src={"/plus_icon_light.svg"}
              width={24}
              height={24}
              alt="plus icon"
              className="dark:opacity-50"
            ></Image>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
