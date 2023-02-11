import Task from "@/models/Task";
import { motion } from "framer-motion";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Progress from "./Progress";
import Slider from "./Slider";

const taskCardButtonVariants = {
  idle: { opacity: 0 },
  hovered: { opacity: 0.5 },
};

export default function TaskCard({
  task,
  tasks,
  setTasks,
  setCompletedTasks,
  save,
}: {
  task: Task;
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setCompletedTasks: Dispatch<SetStateAction<Task[]>>;
  save: (tasks: Task[]) => void;
}) {
  const [progress, setProgress] = useState(task.progress);

  function deleteTask(taskId: number) {
    setTasks((prev) => {
      save(prev.filter((task) => task.id !== taskId));
      return prev.filter((task) => task.id !== taskId);
    });
  }

  function saveCompleted(tasks: Task[]) {
    window.localStorage.setItem("completed_tasks", JSON.stringify(tasks));
  }

  function completeTask(taskId: number) {
    setProgress(100);
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        task.progress = 100;
        task.completed = true;
      }
      return task;
    });
    setTasks((prev) => {
      save(newTasks);
      return newTasks;
    });

    setTimeout(() => {
      const thisTask = tasks.find((task) => task.id === taskId);
      if (thisTask)
        setCompletedTasks((prev) => {
          saveCompleted([...prev, thisTask]);
          return [...prev, thisTask];
        });
      setTasks((prev) => {
        save(prev.filter((task) => task.id !== taskId));
        return prev.filter((task) => task.id !== taskId);
      });
    }, 1000);
  }

  function updateTask(taskId: number, progressChange: number) {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        task.progress = progressChange;
      }
      return task;
    });
    setTasks((old) => {
      save(newTasks);
      return newTasks;
    });
  }

  useEffect(() => {
    updateTask(task.id, progress);
  }, [progress]);

  return (
    <div className="w-full h-full group">
      <p className="text-lg text-slate-900 dark:text-white px-2">
        {task.description}
      </p>
      <Slider value={progress} setValue={setProgress} />
      {!task.completed && (
        <motion.button
          onClick={() => deleteTask(task.id)}
          className="absolute -left-10 md:-left-1/4 top-1/2 opacity-100 dark:opacity-50 md:opacity-0 md:group-hover:opacity-100 md:active:opacity-100 -translate-y-1/2 active:scale-95 active:opacity-100 rounded-xl w-8 h-full md:w-16 md:h-16 bg-pink-600 dark:bg-transparent dark:border-2 border-pink-500  transition-all flex items-center justify-center"
        >
          <Image
            src={"/plus_icon2.svg"}
            width={20}
            height={20}
            alt="plus icon"
            className="rotate-45 hidden dark:flex"
          ></Image>
          <Image
            src={"/plus_icon_light.svg"}
            width={20}
            height={20}
            alt="plus icon"
            className="rotate-45 flex dark:hidden"
          ></Image>
        </motion.button>
      )}
      {!task.completed && (
        <motion.button
          onClick={() => completeTask(task.id)}
          className="absolute -right-10 md:-right-1/4 top-1/2 opacity-100 dark:opacity-50 md:opacity-0 md:group-hover:opacity-100 md:active:opacity-100 -translate-y-1/2 active:scale-95 active:opacity-100 rounded-xl w-8 h-full md:w-16 md:h-16 bg-teal-600 dark:bg-transparent dark:border-2  border-teal-500 transition-all flex items-center justify-center"
        >
          <Image
            src={"/check.svg"}
            width={24}
            height={24}
            alt="plus icon"
            className="hidden dark:flex"
          ></Image>
          <Image
            src={"/check_light.svg"}
            width={24}
            height={24}
            alt="plus icon"
            className="flex dark:hidden"
          ></Image>
        </motion.button>
      )}
    </div>
  );
}
