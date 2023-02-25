import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import TaskCard from "./TaskCard";
import CompletedTaskList from "./CompletedTaskList";
import TaskForm from "./TaskForm";

export default function TaskList() {
  const { tasks, setTasks } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
  }));
  return (
    <div className="w-full flex flex-col space-y-2 px-4 mx-auto lg:mr-4 h-full">
      <div className="hidden lg:flex pb-[0.35rem]">
        <TaskForm></TaskForm>
      </div>
      <AnimatePresence>
        {tasks.length > 0 &&
          tasks
            .filter((task) => !task.completed)
            .map((task) => {
              if (!task.parentTaskId)
                return <TaskCard task={task} key={task.id} />;
            })}
      </AnimatePresence>
      {/* <CompletedTaskList></CompletedTaskList> */}
    </div>
  );
}
