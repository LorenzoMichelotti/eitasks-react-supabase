import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";

export default function TaskList() {
  const { tasks } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
  }));
  return (
    <motion.div className="relative h-[652px] w-full sm:max-w-lg lg:max-w-full flex flex-col space-y-2 mx-auto lg:mr-4">
      <div className="hidden lg:flex pb-[0.35rem]">
        <TaskForm></TaskForm>
      </div>
      <AnimatePresence>
        {tasks.length > 0 &&
          tasks.map((task) => <TaskCard task={task} key={task.id} />)}
      </AnimatePresence>
    </motion.div>
  );
}
