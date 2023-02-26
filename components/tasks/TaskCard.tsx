import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Slider3 from "../Slider3";

export default function TaskCard({
  task,
  canHaveSubtasks = true,
  taskCardVariants,
}: {
  task: Task;
  canHaveSubtasks?: boolean;
  taskCardVariants: {};
}) {
  const [progress, setProgress] = useState(task.progress);

  const { tasks, setTasks, updateTask, activeTask, setActiveTask } =
    useTaskStore((state) => ({
      activeTask: state.activeTask,
      tasks: state.tasks,
      setTasks: state.setTasks,
      removeTask: state.removeTask,
      profile: state.profile,
      updateTask: state.updateTask,
      setActiveTask: state.setActiveTask,
    }));

  function getSubtaskCount(tasks: Task[]) {
    return tasks?.filter((t) => t.parentTaskId === task.id).length;
  }

  function completeTask(taskId: number) {
    setProgress(100);
    if (tasks.some((task) => task.id === taskId && task.completed)) {
      // uncomplete task
      const tryGetTask = tasks.find((task) => task.id === taskId);
      if (!tryGetTask) return;
      const task = tryGetTask;
      task.progress = 0;
      task.completed = false;
      updateTask(task);
    } else {
      // complete task
      const tryGetTask = tasks.find((task) => task.id === taskId);
      if (!tryGetTask) return;
      const task = tryGetTask;
      task.progress = 100;
      task.completed = true;
      updateTask(task);
      toast.success("A task was completed!");
    }
  }

  function handleSetAsActiveTask() {
    if (activeTask?.id !== task.id) setActiveTask(task);
  }

  useEffect(() => {
    if (!task || !task.id) return;
    if (tasks.find((t) => t.id === task.id)?.progress == progress) return;

    if (task.completed && progress < 100) {
      task.completed = false;
      task.progress = progress;
      const updatedList = [...tasks];
      updatedList.splice(
        updatedList.findIndex((t) => t.id == task.id),
        1,
        task
      );
      setTasks(updatedList);
    } else if (progress >= 100) completeTask(task.id);
    else {
      const tryGetTask = tasks.find((t) => t.id === task.id);
      if (tryGetTask) {
        const updatedTask: Task = tryGetTask;
        updatedTask.progress = progress;
        updateTask(updatedTask);
      }
    }
  }, [progress]);

  useEffect(() => {
    const subtasksProgressSum =
      tasks
        .filter((t) => t.parentTaskId === task.id)
        .map((task) => task.progress) ?? [];
    if (subtasksProgressSum.length <= 0) {
      return;
    }
    const totalPercentage =
      subtasksProgressSum.reduce((a, b) => a + b) / subtasksProgressSum.length;

    setProgress(Math.round(totalPercentage));
  }, [tasks, task.id]);

  if (task && task.id != undefined)
    return (
      <motion.div
        variants={taskCardVariants}
        key={task.id}
        onClick={handleSetAsActiveTask}
        className={`w-full h-full cursor-pointer relative flex-col`} //task
      >
        <AnimatePresence>
          {activeTask?.id === task.id && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              key={"task-selection-box"}
              layout
              className="absolute border-4 border-brand-light w-[103%] h-[115%] rounded-2xl -left-2 -top-2"
            ></motion.div>
          )}
        </AnimatePresence>
        <div className="w-full flex group justify-start items-center">
          <div
            className={`flex m-0 w-full flex-col items-start shadow-lg border-2 border-black/50 justify-start bg-white dark:bg-[#1B1B22] h-[102px]
          ${canHaveSubtasks ? "p-2 md:p-4" : "p-1 md:p-2"} 
          ${
            canHaveSubtasks && getSubtaskCount(tasks) > 0
              ? "rounded-t-2xl"
              : "rounded-2xl"
          }`}
          >
            <div className="flex w-full">
              <p
                className={`${
                  canHaveSubtasks ? "text-md" : "text-sm"
                } text-slate-900 dark:text-white px-2`}
              >
                {task.title}
              </p>
            </div>
            <div className="w-full px-2 py-1 mt-auto">
              <Slider3
                locked={true}
                setValue={setProgress}
                value={progress}
                thumbAlwaysVisible={false}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  else return null;
}

const subtasksContainerExpandedVariants = {
  closed: { scaleY: 0, opacity: 0 },
  open: { scaleY: 1, opacity: 1 },
};
