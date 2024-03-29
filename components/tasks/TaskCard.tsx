import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { AnimatePresence, motion } from "framer-motion";
import Slider3 from "../Slider3";

export default function TaskCard({
  task,
  taskCardVariants,
}: {
  task: Task;
  canHaveSubtasks?: boolean;
  taskCardVariants: {};
}) {
  const { activeTask, setActiveTask } = useTaskStore((state) => ({
    activeTask: state.activeTask,
    setActiveTask: state.setActiveTask,
  }));

  function handleSetAsActiveTask() {
    if (activeTask?.id !== task.id) setActiveTask(task);
  }

  if (task && task.id != undefined)
    return (
      <motion.button
        variants={taskCardVariants}
        key={task.id}
        onClick={handleSetAsActiveTask}
        className={`w-full cursor-pointer relative`} //task
      >
        <AnimatePresence>
          {activeTask?.id === task.id && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              key={"task-selection-box"}
              layout
              className="absolute pointer-events-none border-4 border-brand-light w-[103%] h-[115%] rounded-2xl -left-2 -top-2"
            ></motion.div>
          )}
        </AnimatePresence>
        <div className="w-full flex justify-start items-center">
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
      </motion.button>
    );
  else return null;
}
