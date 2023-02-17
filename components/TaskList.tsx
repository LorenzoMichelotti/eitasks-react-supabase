import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import TaskCard from "./TaskCard";
import CompletedTaskList from "./CompletedTaskList";

export default function TaskList() {
  const { tasks, setTasks } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
  }));
  return (
    <div className="w-full flex flex-col mt-12 space-y-4 mx-auto h-full">
      <AnimatePresence>
        {tasks
          .filter((task) => !task.completed)
          .map((task) => {
            if (!task.parentTaskId)
              return <TaskCard task={task} key={task.id} />;
          })}
      </AnimatePresence>
      <CompletedTaskList></CompletedTaskList>
    </div>
  );
}
