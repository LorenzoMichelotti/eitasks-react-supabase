import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Slider from "./Slider";
import TaskCardMenu from "./TaskCardMenu";
import TaskForm from "./TaskForm";

export default function TaskCard({
  task,
  canHaveSubtasks = true,
}: {
  task: Task;
  canHaveSubtasks?: boolean;
}) {
  const [progress, setProgress] = useState(task.progress);
  const [editing, setEditing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const { tasks, setTasks } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
  }));

  function deleteTask(taskId: number) {
    setTasks(
      tasks.filter((task) => task.id !== taskId && task.parentTaskId !== taskId)
    );
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
    setTasks(newTasks);
    setTimeout(() => {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }, 1000);
  }

  function updateTask(taskId: number, progressChange: number) {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        task.progress = progressChange;
      }
      return task;
    });
    setTasks(newTasks);
  }

  useEffect(() => {
    updateTask(task.id, progress);
  }, [progress]);

  useEffect(() => {
    const subtasksProgressSum =
      tasks
        .filter((t) => t.parentTaskId === task.id)
        .map((task) => task.progress) ?? [];
    if (subtasksProgressSum.length <= 0) {
      setIsLocked(false);
      return;
    }
    setIsLocked(true);
    const totalPercentage =
      subtasksProgressSum.reduce((a, b) => a + b) / subtasksProgressSum.length;
    setProgress(Math.round(totalPercentage));
  }, [tasks, task.id]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full flex group justify-start items-center">
        <div
          className={`flex m-0 ${
            editing ? "w-10/12" : "w-full"
          } flex-col items-start justify-start bg-white dark:bg-[#1B1B22] h-fit rounded-2xl p-2 md:p-4 shadow-xl`}
        >
          <div className="flex w-full">
            <p
              className={`${
                canHaveSubtasks ? "text-lg" : "text-sm"
              } text-slate-900 dark:text-white px-2`}
            >
              {task.description}
            </p>
            <div className="ml-auto mr-2">
              <TaskCardMenu
                openForm={() => setEditing((old) => !old)}
                completeTask={() => completeTask(task.id)}
                deleteTask={() => deleteTask(task.id)}
              />
            </div>
          </div>
          <Slider
            size={canHaveSubtasks ? "md" : "sm"}
            value={progress}
            setValue={setProgress}
            isLocked={isLocked}
          />
        </div>
      </div>
      <AnimatePresence>
        <TaskForm
          setIsOpen={setEditing}
          isOpen={editing}
          parentTaskId={task.id}
        />
      </AnimatePresence>
      <div className="w-11/12 mx-auto mt-2">
        {tasks
          ?.filter((t) => t.parentTaskId === task.id)
          ?.map((task) => (
            <TaskCard key={task.id} task={task} canHaveSubtasks={false} />
          ))}
      </div>
    </div>
  );
}
