import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";

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

export default function TaskList() {
  const { tasks, setTasks } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
  }));
  return (
    <motion.div
      initial={"initial"}
      animate={"idle"}
      exit={"exit"}
      variants={taskCardVariants}
      className="relative w-full sm:max-w-lg lg:max-w-full flex flex-col space-y-2 mx-auto lg:mr-4 h-full"
    >
      <div className="hidden lg:flex pb-[0.35rem]">
        <TaskForm></TaskForm>
      </div>
      <AnimatePresence>
        {tasks.length > 0 &&
          tasks
            .filter((task) => !task.completed)
            .map((task) => {
              if (!task.parentTaskId)
                return (
                  <TaskCard
                    taskCardVariants={taskCardVariants}
                    task={task}
                    key={task.id}
                  />
                );
            })}
      </AnimatePresence>
      {/* <CompletedTaskList></CompletedTaskList> */}
    </motion.div>
  );
}
