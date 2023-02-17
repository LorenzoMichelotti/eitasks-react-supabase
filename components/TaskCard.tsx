import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Slider2 from "./Slider2";
import TaskCardMenu from "./TaskCardMenu";

const taskCardVariants = {
  initial: { opacity: 0, y: -20, scaleY: 1 },
  idle: { opacity: 1, y: 0, scaleY: 1 },
  completed: {
    opacity: 1,
    rotateX: 360,
    scaleY: 1,
    scaleX: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
  exit: (param: boolean) => ({
    opacity: 0,
    scale: 1,
    y: param ? -10 : 10,
  }),
};

export default function TaskCard({
  task,
  canHaveSubtasks = true,
}: {
  task: Task;
  canHaveSubtasks?: boolean;
}) {
  const [progress, setProgress] = useState(task.progress);
  const [isLocked, setIsLocked] = useState(false);
  const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(false);

  const { tasks, setTasks } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
  }));

  function handleExpandSubtasks() {
    setIsSubtasksExpanded((prev) => !prev);
  }

  function getSubtaskCount(tasks: Task[]) {
    return tasks?.filter((t) => t.parentTaskId === task.id).length;
  }

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
    if (tasks.find((t) => t.id === task.id)?.progress == progress) return;
    // const subtasks = tasks.filter((t) => t.parentTaskId === task.id);

    if (task.completed && progress < 100) {
      task.completed = false;
      task.progress = progress;
      tasks.splice(
        tasks.findIndex((t) => t.id == task.id),
        1,
        task
      );
      setTasks(tasks);
    } else if (progress >= 100) completeTask(task.id);
    else updateTask(task.id, progress);
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
    <motion.div
      variants={taskCardVariants}
      custom={task.completed}
      initial={"initial"}
      animate={task.completed ? "completed" : "idle"}
      exit={"exit"}
      layout="position"
      key={task.id}
      className={`w-full h-full relative flex-col`} //task
    >
      <div className="w-full flex group justify-start items-center">
        <div
          className={`flex m-0 w-full flex-col items-start shadow-lg border-2 border-black/50 justify-start bg-white dark:bg-[#1B1B22] h-fit 
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
                canHaveSubtasks ? "text-lg" : "text-sm"
              } text-slate-900 dark:text-white px-2`}
            >
              {task.completed && "(completed) "} {task.description}
            </p>
            <div className="ml-auto mr-2 mb-2">
              <TaskCardMenu
                canHaveSubtasks={canHaveSubtasks}
                task={task}
                taskId={task.id}
                completeTask={() => completeTask(task.id)}
                deleteTask={() => deleteTask(task.id)}
              />
            </div>
          </div>
          <div className="w-full px-2 py-1">
            <Slider2
              locked={isLocked}
              setValue={setProgress}
              value={[progress]}
              thumbAlwaysVisible={false}
            />
          </div>
        </div>
      </div>
      {canHaveSubtasks && getSubtaskCount(tasks) > 0 && (
        <>
          <button
            onClick={handleExpandSubtasks}
            className={`dark:text-white w-full flex items-center justify-center space-x-2 p-2 bg-slate-400 dark:bg-brand-dark shadow-xl border-l-2 border-r-2 border-b-2 ${
              !isSubtasksExpanded && "rounded-b-2xl"
            } dark:border-black/50`}
          >
            {isSubtasksExpanded && (
              <>
                <ChevronDownIcon></ChevronDownIcon>
                <span>toggle subtasks</span>
              </>
            )}
            {tasks && !isSubtasksExpanded && canHaveSubtasks && (
              <>
                <ChevronDownIcon></ChevronDownIcon>
                <span>{getSubtaskCount(tasks)} subtasks</span>
              </>
            )}
          </button>
          <AnimatePresence>
            {isSubtasksExpanded && (
              <motion.div
                variants={subtasksContainerExpandedVariants}
                initial={"closed"}
                animate={isSubtasksExpanded ? "open" : "closed"}
                exit={"closed"}
                className="w-full flex flex-col origin-top mx-auto pt-4 pb-2 px-2 rounded-b-2xl bg-slate-400 dark:bg-brand-dark"
              >
                <div className="w-full flex flex-col space-y-2 max-h-56 overflow-auto">
                  {tasks
                    ?.filter((t) => t.parentTaskId === task.id)
                    ?.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        canHaveSubtasks={false}
                      />
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

const subtasksContainerExpandedVariants = {
  closed: { scaleY: 0, opacity: 0 },
  open: { scaleY: 1, opacity: 1 },
};
