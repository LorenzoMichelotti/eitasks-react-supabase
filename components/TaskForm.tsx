import Task from "@/models/Task";
import { motion } from "framer-motion";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import Slider from "./Slider";

export default function TaskForm({
  tasks,
  setTasks,
  save,
}: {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  save: (tasks: Task[]) => void;
}) {
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const textArea = useRef<HTMLTextAreaElement>(null);

  function createTask(description: string, progress: number) {
    if (description == "") {
      console.log("Please enter description", description);
      return;
    }
    console.log("Creating task...");
    const newTask: Task = {
      created: new Date().toLocaleDateString(),
      description,
      progress: Math.round(progress),
      id: tasks.length + 1,
    };
    setTasks((prev) => {
      save([newTask, ...prev]);
      return [newTask, ...prev];
    });
    setDescription("");
    setProgress(0);
  }

  return (
    <div
      className="w-full focus-within:scale-105 transition-transform h-56 flex space-x-2"
      id="task_form_container"
    >
      <div
        className="w-10/12 h-full bg-white dark:bg-[#1B1B22] shadow-xl p-4 rounded-l-2xl rounded-r-md"
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
            createTask(description, progress)
          }
          className="text-slate-900 dark:text-white py-2 px-4 text-[20px] resize-none w-full h-4/6 bg-white border-2 dark:border-none dark:bg-[#151517] rounded-xl"
        ></textarea>
        <Slider
          value={progress}
          setValue={setProgress}
          callback={() => createTask(description, progress)}
        />
      </div>
      <motion.button
        onClick={() => createTask(description, progress)}
        whileHover={{
          backgroundColor: "#485577",
          transition: { duration: 0.2, type: "spring" },
        }}
        whileTap={{
          backgroundColor: "#3D4062",
          scale: 0.95,
          transition: { duration: 0.2, type: "spring" },
        }}
        className="bg-sky-600 dark:bg-[#3C435C] w-2/12 rounded-r-2xl rounded-l-md shadow-xl flex justify-center items-center"
      >
        <Image
          src={"/plus_icon_light.svg"}
          width={24}
          height={24}
          alt="plus icon"
          className="dark:opacity-50"
        ></Image>
      </motion.button>
    </div>
  );
}
