import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Slider3 from "../Slider3";

export default function TaskCard({
  task,
  taskCardVariants,
}: {
  task: Task;
  canHaveSubtasks?: boolean;
  taskCardVariants: {};
}) {
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
                setValue={() => {}}
                value={task.progress}
                thumbAlwaysVisible={false}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  else return null;
}
