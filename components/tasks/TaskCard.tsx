import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Slider3 from "../Slider3";

const taskCardVariants = {
  initial: {
    opacity: 0,
    y: -20,
    scaleY: 1,
    transition: { staggerChildren: 0.1, type: "spring" },
  },
  idle: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { staggerChildren: 0.1, type: "spring" },
  },
  completed: {
    opacity: 1,
    rotateX: 360,
    scaleY: 1,
    scaleX: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: (param: boolean) => ({
    opacity: 0,
    scale: 1,
    y: param ? -10 : 10,
  }),
};

export default function TaskCard({
  task,
}: {
  task: Task;
  canHaveSubtasks?: boolean;
}) {
  const [progress, setProgress] = useState(task.progress);

  const { tasks, activeTask, setActiveTask } = useTaskStore((state) => ({
    activeTask: state.activeTask,
    tasks: state.tasks,
    removeTask: state.removeTask,
    profile: state.profile,
    setActiveTask: state.setActiveTask,
  }));

  function handleSetAsActiveTask() {
    if (activeTask?.id !== task.id) setActiveTask(task);
  }

  useEffect(() => {
    const subtasks = tasks.filter((t) => t.parentTaskId === task.id) ?? [];
    if (subtasks.length <= 0) return;
    const totalPercentage =
      (subtasks.filter((t) => t.completed).length * 100) / subtasks.length;
    setProgress(Math.round(totalPercentage));
  }, [tasks, task.id]);

  if (task && task.id != undefined)
    return (
      <motion.div
        variants={taskCardVariants}
        key={task.id}
        onClick={handleSetAsActiveTask}
        className={`w-full cursor-pointer relative flex-col`} //task
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
            className={`flex m-0 w-full flex-col rounded-2xl items-start shadow-lg border-2 border-black/50 justify-start bg-white dark:bg-[#1B1B22] h-[102px] p-2 md:p-4`}
          >
            <div className="flex w-full">
              <p className={`text-slate-900 dark:text-white px-2`}>
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
